import { QUERY_KEY } from '@/constants/query-key';
import { TrackArtistDataFilter } from '../types';

export const trackArtistQueryKeys = {
    all: [QUERY_KEY.TRACK_ARTIST.KEY] as const,

    lists: () =>
        [...trackArtistQueryKeys.all, QUERY_KEY.TRACK_ARTIST.GET_LIST] as const,
    list: (params?: TrackArtistDataFilter) =>
        params
            ? ([...trackArtistQueryKeys.lists(), params] as const)
            : trackArtistQueryKeys.lists(),
};
