import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetChannelTer = (
    channelId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.channelTer(channelId, params),
        queryFn: () => analytics2Apis.getChannelTer(channelId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!channelId,
    });

    const channelTerData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        channelTerData,
        ...query,
    };
};
