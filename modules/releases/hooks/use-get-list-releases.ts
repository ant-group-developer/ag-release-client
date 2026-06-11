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
    const apiParams = { ...params };
    if (apiParams.isImportedFromReport === 'all') {
        delete apiParams.isImportedFromReport;
    }

    const { data, ...res } = useQuery({
        queryKey: releasesQueryKeys.list(params),
        queryFn: () => releasesApi.getList(apiParams),
        placeholderData: (previousData) => previousData,
        enabled: options?.enabled ?? true,
    });
    const releasesData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releasesData,
        ...res,
    };
};
