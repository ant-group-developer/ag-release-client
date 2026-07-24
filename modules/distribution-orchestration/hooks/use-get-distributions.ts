import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { DistributionListFilter, DistributionListItem } from '../types';

/** GET /distributions — list phát hành + DistributionState (release-centric). */
export const useGetDistributions = (params: DistributionListFilter) => {
    const { data, ...rest } = useQuery({
        queryKey: distributionOrchestrationQueryKeys.list(params),
        queryFn: () => distributionOrchestrationApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const distributionsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<DistributionListItem>['data']);

    return { distributionsData, ...rest };
};
