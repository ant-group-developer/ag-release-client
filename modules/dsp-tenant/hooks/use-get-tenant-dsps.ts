import { useQuery } from '@tanstack/react-query';
import { tenantDspApi } from '../apis';
import { tenantDspQueryKeys } from '../constants/query-keys';
import { TenantDspDataFilter } from '../types';

export const useGetTenantDsps = (params: TenantDspDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: tenantDspQueryKeys.list(params),
        queryFn: () => tenantDspApi.getList(params),
        placeholderData: (prev) => prev,
    });

    return {
        dspData: data?.data?.data ?? [],
        ...res,
    };
};
