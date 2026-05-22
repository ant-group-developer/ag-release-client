import { QUERY_KEY } from '@/constants/query-key';
import { TenantDspDataFilter } from '../types';

export const tenantDspQueryKeys = {
    all: [QUERY_KEY.DSP_SYSTEM.KEY] as const,
    lists: () => [QUERY_KEY.DSP_SYSTEM.GET_LIST] as const,
    list: (filters: TenantDspDataFilter) =>
        [...tenantDspQueryKeys.lists(), filters] as const,
};
