import { CreateBucketFile } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { ReleasesData, VideoData } from '.';
import { RELEASES_TYPE } from '../enums';

interface CreateStandardReleaseDraftPayload {
    title: string;
    albumFormatId: string;
    version?: string;
    labelId: string;
    type?: Exclude<RELEASES_TYPE, RELEASES_TYPE.VIDEO>;
}

interface CreateVideoReleaseDraftPayload {
    title: string;
    version?: string;
    type: RELEASES_TYPE.VIDEO;
}

export type CreateReleaseDraftPayload =
    | CreateStandardReleaseDraftPayload
    | CreateVideoReleaseDraftPayload;

export type UpdateReleaseDraftPayload = Omit<Partial<ReleasesData>, 'video'> & {
    releaseCoverArt?: {
        fileId: string;
    } | null;
    video?: Partial<VideoData>;
};

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
