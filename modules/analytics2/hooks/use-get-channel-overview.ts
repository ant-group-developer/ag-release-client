import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetChannelOverview = (
    channelId: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.channelOverview(channelId, params),
        queryFn: () => analytics2Apis.getChannelOverview(channelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!channelId,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
