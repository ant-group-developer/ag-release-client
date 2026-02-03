import { QUERY_KEY } from '@/constants/query-key';
import { ReleaseArtistDataFilter } from '../types';

export const releaseArtistQueryKeys = {
    all: [QUERY_KEY.RELEASE_ARTIST.KEY] as const,

    lists: () =>
        [
            ...releaseArtistQueryKeys.all,
            QUERY_KEY.RELEASE_ARTIST.GET_LIST,
        ] as const,
    list: (params?: ReleaseArtistDataFilter) =>
        params
            ? ([...releaseArtistQueryKeys.lists(), params] as const)
            : releaseArtistQueryKeys.lists(),
};
