import { DistributionJobFilter } from '../types';

export const distributionJobQueryKeys = {
    all: 'DISTRIBUTION_JOB',
    getList: () => [distributionJobQueryKeys.all, 'GET_LIST_DISTRIBUTION_JOB'],
    getLists: (params: DistributionJobFilter) => [
        ...distributionJobQueryKeys.getList(),
        params,
    ],
};
