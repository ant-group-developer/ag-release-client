import { CommonAttribute, CommonParams, PaginationResponse } from '@/types/api';

export enum DISTRIBUTION_JOB_STATUS {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
    SKIPPED = 'skipped',
}

export enum DISTRIBUTION_JOB_TYPE {
    EMAIL_STATE51 = 'email_state51',
    ADMIN_EXPORT = 'admin_export',
}

export type DistributionJobStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed'
    | 'skipped';

export interface DistributionJobData extends CommonAttribute {
    type: DISTRIBUTION_JOB_TYPE | string;
    upc: string;
    dspCodes: string[];
    releaseSubmitId: string;
    stepId: string;
    releaseId: string;
    status: DistributionJobStatus | string;
    deliveryEmail: string | null;
    deliveryEmailSubject: string | null;
    sentAt: string | null;
    stepLabel: string | null;
    notes: string | null;
}

export interface DistributionJobFilter extends CommonParams {
    status?: DistributionJobStatus | string;
    type?: string;
    releaseId?: string;
    releaseSubmitId?: string;
    stepId?: string;
    upc?: string;
    upcs?: string;
    dateGroup?: string;
}

export interface DistributionJobGroupedData {
    type: DISTRIBUTION_JOB_TYPE;
    deliveryEmail: string;
    deliveryEmailSubject: string;
    dateGroup: string;
    sentAt: string;
    data: DistributionJobData[];
    upcs: string[];
    status: string[];
}

export type DistributionJobPaginationResponse =
    PaginationResponse<DistributionJobData>;

export interface UpdateDistributionJobPayload
    extends Partial<DistributionJobData> {}
