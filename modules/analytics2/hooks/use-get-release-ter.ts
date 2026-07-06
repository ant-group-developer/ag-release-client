import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetReleaseTer = (
    releaseId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.releaseTer(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseTer(releaseId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!releaseId,
    });

    const releaseTerData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releaseTerData,
        ...query,
    };
};
