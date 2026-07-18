import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelDataFilter, ChannelsData } from '../types';

export const useGetListChannelForVideo = (params: ChannelDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.listForVideo(params),
        queryFn: () => channelApi.getListForVideo(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const channelsData: PaginationResponse<ChannelsData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        channelsData,
        ...res,
    };
};
