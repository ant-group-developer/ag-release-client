import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RankingParams } from '../types';

export const useGetChannelTopReleases = (
    channelId: string,
    params: RankingParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.channelTopReleases(channelId, params),
        queryFn: () => analytics2Apis.getChannelTopReleases(channelId, params),
        placeholderData: (prev) => prev,
        ...options,
    });

    const channelTopReleasesData =
        query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        channelTopReleasesData,
        ...query,
    };
};
