import { QUERY_KEY } from '@/constants/query-key';
import { TrackDataFilter } from '../types';

export const trackQueryKeys = {
    all: [QUERY_KEY.TRACK.KEY] as const,

    lists: () => [...trackQueryKeys.all, QUERY_KEY.TRACK.GET_LIST] as const,
    list: (params?: TrackDataFilter) =>
        params
            ? ([...trackQueryKeys.lists(), params] as const)
            : trackQueryKeys.lists(),
    listsByReleaseId: () =>
        [
            ...trackQueryKeys.all,
            QUERY_KEY.TRACK.GET_LIST_BY_RELEASE_ID,
        ] as const,
    listByReleaseId: (releaseId: string, params?: Record<string, any>) =>
        params
            ? ([
                  ...trackQueryKeys.listsByReleaseId(),
                  releaseId,
                  params,
              ] as const)
            : ([...trackQueryKeys.listsByReleaseId(), releaseId] as const),

    details: () => [...trackQueryKeys.all, QUERY_KEY.TRACK.GET_DETAIL] as const,
    detail: (id: string) => [...trackQueryKeys.details(), id] as const,
    listsTracksPolicies: () => [
        ...trackQueryKeys.all,
        QUERY_KEY.TRACK.GET_TRACKS_POLICIES,
    ],
    listTracksPolicies: (params: TrackDataFilter) => [
        ...trackQueryKeys.listsTracksPolicies(),
        params,
    ],
};
