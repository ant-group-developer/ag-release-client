import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { distributionJobApis } from '../apis';
import { distributionJobQueryKeys } from '../constants/query-keys';
import { DistributionJobFilter, DistributionJobGroupedData } from '../types';

export const useGetListDistributionJobsGrouped = (
    params: DistributionJobFilter
) => {
    const { data, ...rest } = useQuery({
        queryKey: distributionJobQueryKeys.getListsGrouped(params),
        queryFn: () => distributionJobApis.getGroupedList(params),
        placeholderData: (prevData) => prevData,
    });

    const distributionJobsGroupedData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DistributionJobGroupedData>['data']);

    return { distributionJobsGroupedData, ...rest };
};
