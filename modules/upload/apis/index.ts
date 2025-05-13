import axiosAuth from '@/api/axios-auth';
import axiosUpload from '@/api/axios-upload';
import { DetailResponse, GetUrlUploadParams } from '@/types/api';
import { GOOGLE_ROOT_FOLDER_DRIVE_ID } from '../constants/folder';
import { FileData, UploadResponse, UploadResponseV2 } from '../types/data';

export const uploadApi = {
    uploadFile: async ({ infoFile, file }: GetUrlUploadParams) => {
        try {
            const response = await axiosAuth.post(
                '/file/get-upload-url',
                infoFile
            );
            if (response.status !== 201) {
                throw new Error(
                    'Failed to get upload URL. Please try again later.'
                );
            }
            const { submitKey, url } = response?.data?.data;

            const uploadResponse = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': infoFile.contentType,
                },
                body: file,
            });

            if (!uploadResponse.ok) {
                throw new Error(
                    'Failed to upload file. Please try again later.'
                );
            }
            return submitKey;
        } catch (error) {
            throw error;
        }
    },

    // uploadFileSubmit: async (params: SubmitUploadParams) => {
    //     return axiosAuth.post('/file/submit-upload', params);
    // },

    getDownloadLink: (fileId: string) => {
        return axiosAuth.get(`/file/get-download-url/${fileId}`);
    },

    getFile: (fileId: string) => {
        return axiosAuth.get<DetailResponse<FileData>>(
            `/file/get-read-url/${fileId}`
        );
    },

    async uploadFileToDrive(
        file: File,
        folderId: string | null = GOOGLE_ROOT_FOLDER_DRIVE_ID
    ): Promise<UploadResponse> {
        // try {
        const formData = new FormData();
        formData.append('file', file);
        // if (folderId) {
        formData.append('folderId', folderId || GOOGLE_ROOT_FOLDER_DRIVE_ID);
        // }

        const response = await axiosUpload.post<UploadResponse>(
            '/drive/upload', // Adjust this URL based on your API endpoint
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10800000, // Set timeout to 180 minutes (10800000 milliseconds)
                // onUploadProgress: (progressEvent) => {
                //     if (onProgress && progressEvent.total) {
                //         const progress =
                //             (progressEvent.loaded / progressEvent.total) * 100;
                //         onProgress(progress);
                //     }
                // },
            }
        );

        return response.data;
        // } catch (error) {
        //     if (axios.isAxiosError(error)) {
        //         return {
        //             success: false,
        //             error: 'Failed to upload file',
        //             details: error.response?.data?.details || error.message,
        //         };
        //     }
        //     return {
        //         success: false,
        //         error: 'Failed to upload file',
        //         details:
        //             error instanceof Error
        //                 ? error.message
        //                 : 'Unknown error occurred',
        //     };
        // }
    },

    async uploadFileToDriveV2(
        file: File,
        folderId: string | null = GOOGLE_ROOT_FOLDER_DRIVE_ID
    ): Promise<UploadResponseV2['data']> {
        // try {
        const formData = new FormData();
        formData.append('file', file);
        // if (folderId) {
        formData.append('folderId', folderId || GOOGLE_ROOT_FOLDER_DRIVE_ID);
        // }

        const response = await axiosUpload.post<UploadResponseV2>(
            'v2/drive/upload', // Adjust this URL based on your API endpoint
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 10800000, // Set timeout to 180 minutes (10800000 milliseconds)
            }
        );

        return response?.data?.data;
    },
};
