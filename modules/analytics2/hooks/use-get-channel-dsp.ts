import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetChannelDsp = (
    channelId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.channelDsp(channelId, params),
        queryFn: () => analytics2Apis.getChannelDsp(channelId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!channelId,
    });

    const channelDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        channelDspData,
        ...query,
    };
};
