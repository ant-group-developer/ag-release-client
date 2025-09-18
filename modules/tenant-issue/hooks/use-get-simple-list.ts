import { useQuery } from '@tanstack/react-query';
import { tenantIssueApis } from '../apis';
import { tenantIssuesQueryKeys } from '../constants/query-keys';
import { TenantIssueData } from '../types';

export const useGetListSimpleTenantIssue = () => {
    const { data, ...res } = useQuery({
        queryKey: tenantIssuesQueryKeys.list(),
        queryFn: () => tenantIssueApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const tenantIssueSimpleData = data?.data?.data ?? ([] as TenantIssueData[]);

    return {
        tenantIssueSimpleData,
        ...res,
    };
};
