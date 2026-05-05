import { CommonAttribute, CommonParams, PaginationResponse } from '@/types/api';

export enum DISTRIBUTION_JOB_STATUS {
    PENDING = 'pending',
    PROCESSING = 'processing',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum DISTRIBUTION_JOB_TYPE {
    EMAIL_STATE51 = 'email_state51',
    ADMIN_EXPORT = 'admin_export',
}

export type DistributionJobStatus =
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';

export interface DistributionJobData extends CommonAttribute {
    type: DISTRIBUTION_JOB_TYPE | string;
    upc: string;
    dspCiCodes: string[];
    releaseSubmitId: string;
    stepId: string;
    releaseId: string;
    status: DistributionJobStatus | string;
    deliveryEmail: string | null;
    deliveryEmailSubject: string | null;
    sentAt: string | null;
    stepLabel: string | null;
}

export interface DistributionJobFilter extends CommonParams {
    status?: DistributionJobStatus;
    type?: string;
    releaseId?: string;
    releaseSubmitId?: string;
    stepId?: string;
    upc?: string;
}

export type DistributionJobPaginationResponse =
    PaginationResponse<DistributionJobData>;
