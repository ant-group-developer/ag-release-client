import axiosInstance from '@/api/axios-auth';
import {
    AbortMultipartResponse,
    CompleteMultipartResponse,
    CreateBucketFile,
    DownloadNonFile,
    InitiateMultipartResponse,
    ListUploadedPartsResponse,
    PresignMultipartPartResponse,
    PresignMultipartPartsResponse,
    UploadedPart,
} from '../types/data';

export const bucketApi = {
    initiateMultipart: async (
        payload: CreateBucketFile
    ): Promise<InitiateMultipartResponse> => {
        const response = await axiosInstance.post(
            '/bucket2/private/multipart/initiate',
            payload
        );
        return response.data.data;
    },

    presignMultipartPart: async (
        fileId: string,
        partNumber: number
    ): Promise<PresignMultipartPartResponse> => {
        const response = await axiosInstance.post(
            `/bucket2/private/${fileId}/multipart/presign-part`,
            { partNumber }
        );
        return response.data.data;
    },

    presignMultipartParts: async (
        fileId: string,
        partNumbers: number[]
    ): Promise<PresignMultipartPartsResponse> => {
        const response = await axiosInstance.post(
            `/bucket2/private/${fileId}/multipart/presign-parts`,
            { partNumbers }
        );
        return response.data.data;
    },

    listMultipartParts: async (
        fileId: string
    ): Promise<ListUploadedPartsResponse> => {
        const response = await axiosInstance.get(
            `/bucket2/private/${fileId}/multipart/parts`
        );
        return response.data.data;
    },

    completeMultipart: async (
        fileId: string,
        parts: Array<{ partNumber: number; eTag: string }>
    ): Promise<CompleteMultipartResponse> => {
        const response = await axiosInstance.post(
            `/bucket2/private/${fileId}/multipart/complete`,
            { parts }
        );
        return response.data.data;
    },

    abortMultipart: async (fileId: string): Promise<AbortMultipartResponse> => {
        const response = await axiosInstance.post(
            `/bucket2/private/${fileId}/multipart/abort`
        );
        return response.data.data;
    },

    createBuckets: async (payload: { bucketDtos: CreateBucketFile[] }) => {
        const response = await axiosInstance.post(
            '/bucket2/private/bulk',
            payload
        );
        return {
            data: response?.data?.data,
        };
    },
    createBucket: async (file: File, payload: CreateBucketFile) => {
        const response = await axiosInstance.post('/bucket2/private', payload);
        if (response.status !== 201) {
            throw new Error(
                'Failed to get upload URL. Please try again later.'
            );
        }

        const { fileId, urlUpload } = response.data.data;

        try {
            await fetch(urlUpload, {
                method: 'PUT',
                headers: {
                    'Content-Type': payload.file.contentType,
                },
                body: file,
            });
        } catch (error) {
            console.log('Upload error:', error);
        }

        return fileId;
    },

    submit: ({ ids }: { ids: string[] }) => {
        return axiosInstance.post('/bucket2/private/bulk/submit', { ids });
    },

    getLinkDownloadFile: (id: string) => {
        return axiosInstance.get(`/bucket2/private/${id}/download`);
    },

    getLinkReadFile: (id: string) => {
        return axiosInstance.get(`/bucket2/private/${id}/read`);
    },

    downloadNonFile: (payload: DownloadNonFile) => {
        return axiosInstance.post(`/bucket2/non-file/download`, payload);
    },
};

