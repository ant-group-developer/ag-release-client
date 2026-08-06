import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { YoutubeChannelSyncRun, YoutubeChannelSyncRunFilter } from '../types';

export const useGetYoutubeChannelSyncRuns = (
    params: YoutubeChannelSyncRunFilter,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.youtubeChannelSyncRuns(params),
        queryFn: () => channelApi.getYoutubeChannelSyncRuns(params),
        placeholderData: (previousData) => previousData,
        enabled,
    });

    const youtubeChannelSyncRuns: PaginationResponse<YoutubeChannelSyncRun>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        youtubeChannelSyncRuns,
        ...res,
    };
};
