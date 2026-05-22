import { TenantDspDataFilter } from '../types';

export const tenantDspQueryKeys = {
    all: ['tenant-dsps'] as const,
    lists: () => [...tenantDspQueryKeys.all, 'list'] as const,
    list: (filters: TenantDspDataFilter) =>
        [...tenantDspQueryKeys.lists(), filters] as const,
};
