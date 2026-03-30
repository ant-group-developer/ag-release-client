import { CreateBucketFile } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { ReleasesData } from '.';

export interface CreateReleaseDraftPayload {
    title: string;
    albumFormatId: string;
    version?: string;
    labelId: string;
}

export interface UpdateReleaseDraftPayload extends Partial<ReleasesData> {
    releaseCoverArt?: {
        fileId: string;
    } | null;
}

export interface GenerateUpc extends CommonFunction {
    releaseId: string;
}

export interface UploadTemplate extends CommonFunction {
    createBucketFile: CreateBucketFile;
    file: File;
}

export interface ExportTemplateCi extends CommonFunction {
    ids: string[];
    dspCodeCi: string[];
}
