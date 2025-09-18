import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { tenantIssueApis } from '../apis';
import { tenantIssuesQueryKeys } from '../constants/query-keys';
import { TenantIssueData, TenantIssueDataFilter } from '../types';

export const useGetListTenantIssue = (params: TenantIssueDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: tenantIssuesQueryKeys.list(params),
        queryFn: () => tenantIssueApis.getList(params),
        placeholderData: (prev) => prev,
    });

    const tenantIssueData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<TenantIssueData>['data']);

    return {
        tenantIssueData,
        ...res,
    };
};
