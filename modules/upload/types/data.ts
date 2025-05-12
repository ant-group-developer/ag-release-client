import { DetailResponse } from '@/types/api';

export type UploadResponse = {
    success: boolean;
    fileId?: string;
    metadata?: {
        name: string;
        size: string;
        mimeType: string;
        createdTime: string;
        modifiedTime: string;
    };
    error?: string;
    details?: string;
};

export type UploadResponseV2 = DetailResponse<string>;

export interface UploadProgressCallback {
    (progress: number): void;
}
