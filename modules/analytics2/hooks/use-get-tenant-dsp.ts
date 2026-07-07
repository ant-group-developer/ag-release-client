import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetTenantDsp = (
    tenantId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.tenantDsp(tenantId, params),
        queryFn: () => analytics2Apis.getTenantDsp(tenantId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!tenantId,
    });

    const tenantDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        tenantDspData,
        ...query,
    };
};
