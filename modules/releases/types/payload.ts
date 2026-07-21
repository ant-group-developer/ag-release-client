import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { RELEASE_VIDEO_CAPTION_TYPE } from '@/modules/release-video/enums';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { CommonFunction } from '@/types/api';
import { ReleaseEnrichedError, ReleasesData, VideoData } from '.';
import {
    RELEASES_TYPE,
    RELEASE_ERROR_APPROVAL_STATUS,
    RELEASE_ERROR_SUBMISSION_STATUS,
    RELEASE_ERROR_TYPE,
    RELEASE_REVIEW_STATUS,
    RELEASE_TYPE,
} from '../enums';

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
    status?: RELEASE_DSP_DELIVERY_STATUS;
    needImportAgain?: boolean;
    skipDistributed?: boolean;
}

export interface AutoSubmitUndistributedMusicRelease extends CommonFunction {
    dspCodes: string[];
    status?: string;
    neverExported?: boolean;
    lastImportFailed?: boolean;
}
export interface BulkDeleteRelease extends CommonFunction {
    ids: string[];
}

export interface BulkUpdateReleaseErrorItem {
    id: ReleaseEnrichedError['id'];
    submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
    approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
}

export interface BulkUpdateReleaseErrorsPayload {
    items: BulkUpdateReleaseErrorItem[];
}

export interface CreateReleaseErrorItem {
    releaseId: ReleasesData['id'];
    releaseExecutionId?: string;
    stepId?: string;
    releaseReviewId?: string;
    messageCode?: string;
    message: string;
    page?: string;
    field?: string;
    trackId?: string;
    type?: RELEASE_ERROR_TYPE;
}

export interface BulkCreateReleaseErrorsPayload {
    items: CreateReleaseErrorItem[];
}

export interface UpdateReleaseReviewDecisionPayload {
    status: RELEASE_REVIEW_STATUS.COMPLETED | RELEASE_REVIEW_STATUS.FAILED;
    note?: string;
}

export interface SyncReleaseDraftToTracksPayload {
    syncPrimaryGenre: boolean;
    syncSubGenre: boolean;
    syncLanguage: boolean;
    syncCopyright: boolean;
    syncArtists: boolean;
    syncContributors: boolean;
    syncIsInstrumental: boolean;
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
