import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { trackSensitiveApis } from '../apis';
import { trackSensitiveQueryKeys } from '../constants/query-keys';
import { TrackSensitiveFilter } from '../types';

export const useGetListTrackSensitive = (params: TrackSensitiveFilter) => {
    const { data, ...res } = useQuery({
        queryKey: trackSensitiveQueryKeys.list(params),
        queryFn: () => trackSensitiveApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const trackSensitiveData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        trackSensitiveData,
        ...res,
    };
};
