import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetReleaseOverview = (
    releaseId: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.releaseOverview(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseOverview(releaseId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!releaseId,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
