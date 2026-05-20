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

export interface BulkSubmitRelease extends CommonFunction {
    ids: string[];
    codes: string[];
}
export interface BulkDeleteRelease extends CommonFunction {
    ids: string[];
}

export interface SyncReleaseDraftToTracksPayload {
    syncPrimaryGenre: boolean;
    syncSubGenre: boolean;
    syncLanguage: boolean;
    syncCopyright: boolean;
    syncArtists: boolean;
    syncContributors: boolean;
}

export interface SyncReleaseDraftToTracks extends CommonFunction {
    id: ReleasesData['id'];
    payload: SyncReleaseDraftToTracksPayload;
}
