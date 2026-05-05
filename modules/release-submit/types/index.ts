import { DspData } from '@/modules/dsp/types';
import { ReleasesData } from '@/modules/releases/types';
import { CommonAttribute, CommonParams, PaginationResponse } from '@/types/api';
import {
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
    releaseId?: string;
    type?: RELEASE_SUBMIT_TYPE;
    status?: RELEASE_SUBMIT_STATUS;
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
}

export interface ReleaseSubmitLogsData extends CommonAttribute {
    releaseSubmitId: ReleaseSubmitData['id'];
    releaseSubmitStepId: ReleaseSubmitStepData['id'];
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
