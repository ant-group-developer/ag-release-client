import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { releaseDspApis } from '../apis';
import { releaseDspQueryKey } from '../constants/query-keys';
import { ReleaseDspData, ReleaseDspDataFilter } from '../types';

export const useGetListReleaseDsp = (
    id: string,
    params: ReleaseDspDataFilter
) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseDspQueryKey.detail(id, params),
        queryFn: () => releaseDspApis.getListDspDistribute(id, params),
    });

    return {
        releaseDsp:
            data?.data?.data ??
            (DEFAULT_DATA_PAGINATION as PaginationResponse<ReleaseDspData>['data']),
        ...rest,
    };
};
