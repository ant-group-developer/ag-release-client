import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { DATE_FORMAT } from '@/enums/common';
import { formattedDate } from '@/helpers/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelDataFilter, ChannelsData } from '../types';

export const useGetListChannel = (params: ChannelDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: channelQueryKeys.list(params),
        queryFn: () => channelApi.getList(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const channelsData: PaginationResponse<ChannelsData>['data'] =
        data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    const lastUpdatedAt = formattedDate(
        res.dataUpdatedAt,
        DATE_FORMAT.HOUR_MINUTE_SECOND
    );

    return {
        channelsData: channelsData,
        lastUpdatedAt,
        ...res,
    };
};
