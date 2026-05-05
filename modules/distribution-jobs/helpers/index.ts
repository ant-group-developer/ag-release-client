import { DistributionJobStatus } from '../types';

export const getDistributionJobStatusColor = (
    status?: DistributionJobStatus | string | null
) => {
    switch (status) {
        case 'completed':
            return 'success';
        case 'failed':
            return 'error';
        case 'processing':
            return 'processing';
        case 'pending':
            return 'warning';
        default:
            return 'default';
    }
};
