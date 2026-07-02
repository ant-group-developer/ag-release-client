import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';
import { ReleaseCiDataFilter } from '../types';

export const useGetListReleaseCiData = (
    params: ReleaseCiDataFilter,
    options?: {
        enabled: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseDistributionQueryKeys.list(params),
        queryFn: () => releaseDistributionApi.getListReleaseCiData(params),
        placeholderData: (previousData) => previousData,
        enabled: options?.enabled ?? true,
    });
    const releaseCiDataList = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        releaseCiDataList,
        ...res,
    };
};
