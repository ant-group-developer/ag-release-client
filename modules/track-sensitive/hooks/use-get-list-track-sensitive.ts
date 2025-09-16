import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { trackSensitiveApis } from '../apis';
import { trackSensitiveQueryKeys } from '../constants/query-keys';
import { TrackSensitiveData, TrackSensitiveFilter } from '../types';

export const useGetListTrackSensitive = (params: TrackSensitiveFilter) => {
    const { data, ...res } = useQuery({
        queryKey: trackSensitiveQueryKeys.list(params),
        queryFn: () => trackSensitiveApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const trackSensitiveData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<TrackSensitiveData>['data']);

    return {
        trackSensitiveData,
        ...res,
    };
};
