import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { distributionJobApis } from '../apis';
import { distributionJobQueryKeys } from '../constants/query-keys';
import {
    DistributionJobFilter,
    DistributionJobPaginationResponse,
} from '../types';

export const useGetListDistributionJobs = (params: DistributionJobFilter) => {
    const { data, ...rest } = useQuery({
        queryKey: distributionJobQueryKeys.getLists(params),
        queryFn: () => distributionJobApis.getList(params),
        placeholderData: (prevData) => prevData,
    });

    const distributionJobsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as DistributionJobPaginationResponse['data']);

    return { distributionJobsData, ...rest };
};
