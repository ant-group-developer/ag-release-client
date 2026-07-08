import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetTenantTopTracks = (
    tenantId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.tenantTopTracks(tenantId, params),
        queryFn: () => analytics2Apis.getTenantTopTracks(tenantId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const tenantTopTracksData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tenantTopTracksData,
        ...query,
    };
};
