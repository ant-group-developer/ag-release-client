import { useQuery } from '@tanstack/react-query';
import { tenantTiersApis } from '../apis';
import { tenantTiersQueryKeys } from '../constants/query-keys';
import { TenantTiersData } from '../types';

export const useGetListSimpleTenantTiers = () => {
    const { data, ...res } = useQuery({
        queryKey: tenantTiersQueryKeys.list(),
        queryFn: () => tenantTiersApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const tenantTiersSimpleData = data?.data?.data ?? ([] as TenantTiersData[]);

    return {
        tenantTiersSimpleData,
        ...res,
    };
};
