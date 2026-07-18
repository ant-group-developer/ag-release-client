import { DspData } from '@/modules/dsp/types';
import { RELEASES_STATUS, RELEASE_TYPE } from '@/modules/releases/enums';
import { ReleasesData } from '@/modules/releases/types';
import { CommonAttribute, CommonParams, PaginationResponse } from '@/types/api';
import {
    CHILD_EXECUTION_MODE,
    RELEASE_EXECUTION_STEP_TYPE,
    RELEASE_SUBMIT_LOG_LEVEL,
    RELEASE_SUBMIT_STATUS,
    RELEASE_SUBMIT_STEP_STATUS,
    RELEASE_SUBMIT_STEP_TYPE,
    RELEASE_SUBMIT_TYPE,
} from '../enums';

export interface ReleaseSubmitData extends CommonAttribute {
    releaseId: ReleasesData['id'];
    type: RELEASE_SUBMIT_TYPE;
    status: RELEASE_SUBMIT_STATUS;
    metadata: {
        input: {
            upcAutoIfReleaseSnapshotNull: string;
            dspCodes: string[];
            releaseSnapshot: ReleasesData;
        };
    };
    summary: string | null;
    completedAt: string | null;
    steps: ReleaseSubmitStepData[];
    logs: ReleaseSubmitLogsData[];
}

export interface ReleaseSubmitFilter extends CommonParams {
    releaseIds?: string[];
    releaseId?: string;
    type?: RELEASE_SUBMIT_TYPE;
    status?: RELEASE_SUBMIT_STATUS;
    latestOnly?: boolean | string;
    steps?: ReleaseExecutionStepFilter[];
    queryListReleases?: QueryListReleasesFilter;
}

export interface ReleaseExecutionStepFilter {
    type?: RELEASE_EXECUTION_STEP_TYPE;
    status?: RELEASE_SUBMIT_STEP_STATUS;
    exclude?: boolean;
}

export interface QueryListReleasesFilter extends CommonParams {
    type?: RELEASE_TYPE | RELEASE_TYPE[];
    status?: RELEASES_STATUS | RELEASES_STATUS[];
    startDateCreated?: string;
    endDateCreated?: string;
    startDateRelease?: string;
    endDateRelease?: string;
    genres?: string | string[];
    artistId?: string | string[];
    labelId?: string | string[];
    albumFormatId?: string | string[];
    releaseId?: string;
    isVariousArtist?: string | string[];
    idInclude?: string | string[];
    isImportedFromReport?: string | string[];
    tenantIds?: string | string[];
}

export interface ReleaseSubmitStepData extends CommonAttribute {
    releaseSubmitId: ReleaseSubmitData['id'];
    status: RELEASE_SUBMIT_STEP_STATUS;
    type: RELEASE_SUBMIT_STEP_TYPE;
    parentStepId: string | null;
    order: number;
    dsp: DspData | null;
    startedAt: string | null;
    completedAt: string | null;
    retryCount: number;
    metadata: any | null;
    childSteps: ReleaseSubmitStepData[];
    logs?: ReleaseSubmitLogsData[];
    childExecutionMode?: CHILD_EXECUTION_MODE;
    isDeliveryStep?: boolean;
}

export interface ReleaseSubmitLogsData extends CommonAttribute {
    releaseSubmitId: ReleaseSubmitData['id'];
    releaseSubmitStepId: ReleaseSubmitStepData['id'];
    releaseExecutionId: string;
    releaseExecutionStepId: string;
    message: string;
    level: RELEASE_SUBMIT_LOG_LEVEL;
    data: any;
}

export type ReleaseSubmitStatusCounts = Record<RELEASE_SUBMIT_STATUS, number>;

export type ReleaseSubmitPaginationResponse = Omit<
    PaginationResponse<ReleaseSubmitData>,
    'data'
> & {
    data: {
        items: ReleaseSubmitData[];
        metadata: PaginationResponse<ReleaseSubmitData>['data']['metadata'] & {
            statusCounts?: Partial<ReleaseSubmitStatusCounts>;
        };
    };
};
