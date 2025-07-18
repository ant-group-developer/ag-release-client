import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackDataFilter } from '../types';

export const useGetListTracks = (params: TrackDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [...trackQueryKeys.getList, params],
        queryFn: () => trackApi.getListTrack(params),
        enabled: !!params.releaseId,
    });

    const tracksData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tracksData,
        ...res,
    };
};
