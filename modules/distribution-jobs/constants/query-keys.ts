import { QUERY_KEY } from '@/constants/query-key';
import { DistributionJobFilter } from '../types';

export const distributionJobQueryKeys = {
    all: QUERY_KEY.DISTRIBUTION_JOB.KEY,
    getList: () => [
        distributionJobQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_JOB.GET_LIST,
    ],
    getLists: (params: DistributionJobFilter) => [
        ...distributionJobQueryKeys.getList(),
        params,
    ],
    getListGrouped: () => [
        distributionJobQueryKeys.all,
        QUERY_KEY.DISTRIBUTION_JOB.GET_LIST_GROUPED,
    ],
    getListsGrouped: (params: DistributionJobFilter) => [
        ...distributionJobQueryKeys.getListGrouped(),
        params,
    ],
};
