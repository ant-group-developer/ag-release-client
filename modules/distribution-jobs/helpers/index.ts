import { DISTRIBUTION_JOB_STATUS, DISTRIBUTION_JOB_TYPE } from '../types';

export const getDistributionJobStatusColor = (
    status?: DISTRIBUTION_JOB_STATUS | string | null
) => {
    switch (status) {
        case DISTRIBUTION_JOB_STATUS.COMPLETED:
            return 'success';
        case DISTRIBUTION_JOB_STATUS.FAILED:
            return 'error';
        case DISTRIBUTION_JOB_STATUS.PROCESSING:
            return 'processing';
        case DISTRIBUTION_JOB_STATUS.PENDING:
            return 'processing';
        case DISTRIBUTION_JOB_STATUS.SKIPPED:
        case DISTRIBUTION_JOB_STATUS.CANCEL:
            return 'orange';
        default:
            return 'default';
    }
};

export const getDistributionJobTypeColor = (type?: string | null) => {
    switch (type) {
        case DISTRIBUTION_JOB_TYPE.EMAIL_STATE51:
            return 'geekblue';
        case DISTRIBUTION_JOB_TYPE.ADMIN_EXPORT:
            return 'magenta';
        default:
            return 'default';
    }
};
