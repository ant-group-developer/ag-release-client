import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseVideoDataFilter } from '../types';

export const releaseVideoQueryKeys = {
    all: [QUERY_KEY.RELEASE_VIDEO.KEY] as const,

    lists: () => [...releaseVideoQueryKeys.all, QUERY_KEY.RELEASE_VIDEO.GET_LIST] as const,
    list: (params: ReleaseVideoDataFilter) => [...releaseVideoQueryKeys.lists(), params] as const,

    details: () => [...releaseVideoQueryKeys.all, QUERY_KEY.RELEASE_VIDEO.GET_DETAIL] as const,
    detail: (id: string) => [...releaseVideoQueryKeys.details(), id] as const,
};
