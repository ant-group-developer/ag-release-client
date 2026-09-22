import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleaseStatusCounts, ReleaseStatusCountsFilter } from '../types';

export const useGetReleaseStatusCounts = (
    params?: ReleaseStatusCountsFilter,
    options?: {
        enabled?: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.statusCounts(params),
        queryFn: () => releasesApi.getStatusCounts(params),
        enabled: options?.enabled ?? true,
    });

    const statusCounts: ReleaseStatusCounts =
        ((data?.data as any)?.data ?? data?.data) ?? {};

    return {
        statusCounts,
        ...res,
    };
};
