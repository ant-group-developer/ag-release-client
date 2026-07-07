import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetTrackDsp = (
    isrc: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.trackDsp(isrc, params),
        queryFn: () => analytics2Apis.getTrackDsp(isrc, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!isrc,
    });

    const trackDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        trackDspData,
        ...query,
    };
};
