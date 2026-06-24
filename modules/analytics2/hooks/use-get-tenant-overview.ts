import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetTenantOverview = (
    tenantId: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.tenantOverview(tenantId, params),
        queryFn: () => analytics2Apis.getTenantOverview(tenantId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!tenantId,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
