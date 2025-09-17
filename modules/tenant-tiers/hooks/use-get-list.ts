import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { tenantTiersApis } from '../apis';
import { tenantTiersQueryKeys } from '../constants/query-keys';
import { TenantTiersData, TenantTiersDataFilter } from '../types';

export const useGetListTenantTiers = (params: TenantTiersDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: tenantTiersQueryKeys.list(params),
        queryFn: () => tenantTiersApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const tenantTiersData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<TenantTiersData>['data']);

    return {
        tenantTiersData,
        ...res,
    };
};
