import axiosInstance from '@/api/axios-auth';
import { CreateBucketFile } from '../types/data';

export const bucketApi = {
    createBuckets: async (payload: { bucketDtos: CreateBucketFile[] }) => {
        const response = await axiosInstance.post(
            '/bucket/gcs/private/bulk',
            payload
        );
        return {
            data: response?.data?.data,
        };
    },
    createBucket: async (file: File, payload: CreateBucketFile) => {
        const response = await axiosInstance.post(
            '/bucket/gcs/private',
            payload
        );
        if (response.status !== 201) {
            throw new Error(
                'Failed to get upload URL. Please try again later.'
            );
        }

        const { fileId, urlUpload } = response.data.data;

        const uploadResponse = await fetch(urlUpload, {
            method: 'PUT',
            headers: {
                'Content-Type': payload.file.contentType,
            },
            body: file,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file. Please try again later.');
        }

        return fileId;
    },

    submit: ({ ids }: { ids: string[] }) => {
        return axiosInstance.post('/bucket/gcs/private/bulk/submit', { ids });
    },

    getLinkDownloadFile: (id: string) => {
        return axiosInstance.get(`/bucket/gcs/private/${id}/download`);
    },

    getLinkReadFile: (id: string) => {
        return axiosInstance.get(`/bucket/gcs/private/${id}/read`);
    },
};
