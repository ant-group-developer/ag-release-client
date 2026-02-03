import { CommonAttribute, DetailResponse } from '@/types/api';

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
    preview: number | null;
    sampleLength: number | null;
    hook?: number | null;
    trackId?: string | null;
    fileId?: string | null;
    peakId?: string | null;
    file?: FileBucket;
    peak?: FileBucket;
}

export interface FileBucket extends CommonAttribute {
    isSubmitted: boolean;
    fileName: string;
    key: string;
    contentType: string;
    extension: string;
    fileSize: string;
    bucket: string;
    urlRead: string;
}

export interface CreateBucketFile {
    folderBucket: {
        releaseId: string;
        uploadPurpose: string;
        trackFileName?: string;
    };
    file: {
        fileName: string;
        contentType: string;
        extension: string;
        fileSize: number;
    };
    key?: string;
}

export enum ENTITY_TYPE_PICTURE {
    ARTIST = 'artists',
    DSP = 'dsps',
    LABEL = 'labels',
    GENRE = 'genres',
    TRACK = 'tracks',
    TENANT = 'tenants',
    LOGO = 'logo',
    TRACK_SENSITIVE = 'track_sensitive',
    NEWS_POST_THUMBNAIL = 'news_post_thumbnail',
    NEWS_POST_CONTENT = 'news_post_content',
}

export interface DownloadNonFile {
    url: string;
    isPublic: boolean;
    fileName: string;
}
