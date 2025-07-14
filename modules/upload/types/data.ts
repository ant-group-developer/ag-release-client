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

export interface FileData {
    id: string;
    url: string;
    name: string;
    contentType: string;
    size: number;
}

export interface AudioFileBucket {
    sampleRate: string;
    bitrate: string | null;
    bitDepth: number | null;
    duration?: number;
    hook?: number | null;
    trackId?: string | null;
    fileId?: string | null;
    peakId?: string | null;
    file?: string | null;
    peak?: string | null;
}

export interface CreateBucketFile {
    uploadPurpose: string;
    file: {
        fileName: string;
        contentType: string;
        extension: string;
        fileSize: number;
    };
    key?: string;
}
