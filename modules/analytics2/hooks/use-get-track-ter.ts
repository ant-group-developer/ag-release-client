import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetTrackTer = (
    isrc: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.trackTer(isrc, params),
        queryFn: () => analytics2Apis.getTrackTer(isrc, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!isrc,
    });

    const trackTerData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        trackTerData,
        ...query,
    };
};
