import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackData, TrackDataFilter } from '../types';

export const useGetListTracksWithPolicies = (params: TrackDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: trackQueryKeys.listTracksPolicies(params),
        queryFn: () => trackApi.getTracksWithPolicies(params),
        placeholderData: (prev) => prev,
        enabled: params.hasOwnProperty('releaseId') ? !!params.releaseId : true,
    });

    const tracksData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<TrackData>['data']);

    return {
        tracksData,
        ...res,
    };
};
