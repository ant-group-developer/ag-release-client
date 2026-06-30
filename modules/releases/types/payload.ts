import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { ReleaseEnrichedError, ReleasesData, VideoData } from '.';
import { RELEASE_ERROR_SUBMISSION_STATUS, RELEASES_TYPE, RELEASE_TYPE } from '../enums';

interface CreateStandardReleaseDraftPayload {
    title: string;
    albumFormatId: string;
    version?: string;
    labelId: string;
    type?: RELEASES_TYPE;
}

interface CreateVideoReleaseDraftPayload {
    title: string;
    version?: string;
    type: RELEASE_TYPE.VIDEO;
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
    idsExclude?: string[];
}
export interface BulkDeleteRelease extends CommonFunction {
    ids: string[];
}

export interface BulkUpdateReleaseErrorItem {
    id: ReleaseEnrichedError['id'];
    submissionStatus: RELEASE_ERROR_SUBMISSION_STATUS;
}

export interface BulkUpdateReleaseErrorsPayload {
    items: BulkUpdateReleaseErrorItem[];
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

export interface UpsertReleaseCaptionsPayload extends CommonFunction {
    releaseId: string;
    languageId: string;
    type: RELEASE_VIDEO_CAPTION_TYPE;
    fileId: string;
}

export interface UpdateReleaseCaptionPayload extends CommonFunction {
    id: string;
    languageId?: string;
    type?: RELEASE_VIDEO_CAPTION_TYPE;
    fileId?: string;
}
