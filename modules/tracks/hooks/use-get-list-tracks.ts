import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackDataFilter } from '../types';

export const useGetListTracks = (params: TrackDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: trackQueryKeys.list(params),
        queryFn: () => trackApi.getListTrack(params),
        placeholderData: (prev) => prev,
        enabled: params.hasOwnProperty('releaseId') ? !!params.releaseId : true,
        refetchOnWindowFocus: true,
    });

    const tracksData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tracksData,
        ...res,
    };
};
