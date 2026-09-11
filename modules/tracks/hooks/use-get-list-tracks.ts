import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackDataFilter } from '../types';

export const useGetListTracks = (
    params: TrackDataFilter,
    options?: { enabled?: boolean }
) => {
    const apiParams = { ...params };
    if (apiParams.isImportedFromReport === 'all') {
        delete apiParams.isImportedFromReport;
    }

    const { data, ...res } = useQuery({
        queryKey: trackQueryKeys.list(params),
        queryFn: () => trackApi.getListTrack(apiParams),
        placeholderData: (prev) => prev,
        enabled:
            (options?.enabled ?? true) &&
            (params.hasOwnProperty('releaseId') ? !!params.releaseId : true),
        refetchOnWindowFocus: true,
    });

    const tracksData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tracksData,
        ...res,
    };
};
