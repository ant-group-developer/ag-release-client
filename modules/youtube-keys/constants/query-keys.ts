import { QUERY_KEY } from '@/constants/query-key';
import { YoutubeKeyDataFilter } from '../types';

export const youtubeKeysQueryKeys = {
    all: [QUERY_KEY.YOUTUBE_KEY.KEY] as const,

    lists: () => [...youtubeKeysQueryKeys.all, QUERY_KEY.YOUTUBE_KEY.GET_YOUTUBE_KEYS_LIST] as const,
    list: (params?: YoutubeKeyDataFilter) =>
        params
            ? ([...youtubeKeysQueryKeys.lists(), params] as const)
            : youtubeKeysQueryKeys.lists(),
    details: () => [...youtubeKeysQueryKeys.all, QUERY_KEY.YOUTUBE_KEY.GET_YOUTUBE_KEY_DETAIL] as const,
    detail: (id: string | number) => [...youtubeKeysQueryKeys.details(), id] as const,
};
