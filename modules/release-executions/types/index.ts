import { AggregatorData } from '@/modules/aggregator/types';
import { DspData } from '@/modules/dsp/types';
import { LogData } from '@/modules/log/types/data';
import { ReleasesData } from '@/modules/releases/types';
import { UserData } from '@/modules/user/types/data';
import {
    CommonAttribute,
    CommonParams,
    PaginationResponse,
} from '@/types/api';
import {
    RELEASE_EXECUTION_STATUS,
    RELEASE_EXECUTION_TYPE,
    STEP_STATUS,
    STEP_TYPE,
} from '../enums';

export interface ReleaseExecutionData extends CommonAttribute {
    releaseId: string;
    release?: ReleasesData;
    type: RELEASE_EXECUTION_TYPE;
    status: RELEASE_EXECUTION_STATUS;
    originalDspCodes: string[];
    triggeredBy?: UserData;
    triggeredById?: string;
    startedAt: string | null;
    completedAt: string | null;
    summary: string | null;
    executionDsps?: ExecutionDspData[];
}

export interface ReleaseExecutionFilter extends CommonParams {
    releaseId?: string;
    type?: RELEASE_EXECUTION_TYPE;
    status?: RELEASE_EXECUTION_STATUS;
}

export interface StepData extends CommonAttribute {
    executionDspId: string;
    stepType: STEP_TYPE;
    status: STEP_STATUS;
    order: number;
    dspId?: string;
    dsp?: DspData;
    aggregatorId?: string;
    aggregator?: AggregatorData;
    logs?: LogData;
    metadata?: string;
    startedAt?: string;
    completedAt?: string;
    completedById?: string;
    completedBy?: UserData;
    retryCount: number;
}

export interface ExecutionDspData extends CommonAttribute {
    executionId: string;
    dspId: string;
    dsp?: DspData;
    status: RELEASE_EXECUTION_STATUS;
    steps?: StepData[];
}

export type ReleaseExecutionStatusCounts = Record<
    RELEASE_EXECUTION_STATUS,
    number
>;

export type ReleaseExecutionPaginationResponse = Omit<
    PaginationResponse<ReleaseExecutionData>,
    'data'
> & {
    data: {
        items: ReleaseExecutionData[];
        metadata: PaginationResponse<ReleaseExecutionData>['data']['metadata'] & {
            statusCounts?: Partial<ReleaseExecutionStatusCounts>;
        };
    };
};
