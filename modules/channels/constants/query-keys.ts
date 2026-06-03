import { QUERY_KEY } from '@/constants/query-key';
import { ChannelDataFilter } from '../types';

export const channelQueryKeys = {
    all: [QUERY_KEY.CHANNEL.KEY] as const,

    lists: () =>
        [...channelQueryKeys.all, QUERY_KEY.CHANNEL.GET_CHANNEL_LIST] as const,
    listsSimple: () =>
        [
            ...channelQueryKeys.all,
            QUERY_KEY.CHANNEL.GET_CHANNEL_LIST_SIMPLE,
        ] as const,
    list: (params?: ChannelDataFilter) =>
        params
            ? ([...channelQueryKeys.lists(), params] as const)
            : channelQueryKeys.lists(),

    details: () =>
        [
            ...channelQueryKeys.all,
            QUERY_KEY.CHANNEL.GET_CHANNEL_DETAIL,
        ] as const,
    detail: (id: string) => [...channelQueryKeys.details(), id] as const,
};
