import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetReleaseDsp = (
    releaseId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.releaseDsp(releaseId, params),
        queryFn: () => analytics2Apis.getReleaseDsp(releaseId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!releaseId,
    });

    const releaseDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releaseDspData,
        ...query,
    };
};
