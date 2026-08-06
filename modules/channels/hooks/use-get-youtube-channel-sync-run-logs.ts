import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import {
    YoutubeChannelSyncRunLog,
    YoutubeChannelSyncRunLogFilter,
} from '../types';

export const useGetYoutubeChannelSyncRunLogs = (
    params: YoutubeChannelSyncRunLogFilter,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.youtubeChannelSyncRunLogs(params),
        queryFn: () => channelApi.getYoutubeChannelSyncRunLogs(params),
        placeholderData: (previousData) => previousData,
        enabled,
    });

    const youtubeChannelSyncRunLogs: PaginationResponse<YoutubeChannelSyncRunLog>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        youtubeChannelSyncRunLogs,
        ...res,
    };
};
