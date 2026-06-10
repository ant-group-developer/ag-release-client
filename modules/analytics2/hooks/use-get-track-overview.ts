import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetTrackOverview = (
    isrc: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trackOverview(isrc, params),
        queryFn: () => analytics2Apis.getTrackOverview(isrc, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!isrc,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
