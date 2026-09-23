import { CommonAttribute, CommonParams, PaginationResponse } from '@/types/api';

export enum DISTRIBUTION_JOB_STATUS {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    SKIPPED = 'SKIPPED',
    CANCEL = 'CANCEL',
}

export enum DISTRIBUTION_JOB_TYPE {
    EMAIL_STATE51 = 'EMAIL_STATE51',
    ADMIN_EXPORT = 'ADMIN_EXPORT',
    ADMIN_TAKEDOWN = 'ADMIN_TAKEDOWN',
    EMAIL_STATE51_TAKEDOWN = 'EMAIL_STATE51_TAKEDOWN',
}

export interface DistributionJobData extends CommonAttribute {
    type: DISTRIBUTION_JOB_TYPE | string;
    upc: string;
    dspCodes: string[];
    releaseSubmitId: string;
    stepId: string;
    releaseId: string;
    status: DISTRIBUTION_JOB_STATUS | string;
    deliveryEmail: string | null;
    deliveryEmailSubject: string | null;
    sentAt: string | null;
    stepLabel: string | null;
    notes: string | null;
}

export interface DistributionJobFilter extends CommonParams {
    status?: DISTRIBUTION_JOB_STATUS | string;
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
