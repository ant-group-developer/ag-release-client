import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesDataFilter } from '../types';

export const useGetListReleases = (
    params: ReleasesDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.list(params),
        queryFn: () => releasesApi.getList(params),
        placeholderData: (previousData) => previousData,
        enabled: options?.enabled ?? true,
    });
    const releasesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releasesData,
        ...res,
    };
};
