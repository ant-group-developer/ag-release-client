import { useQuery } from '@tanstack/react-query';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { TenantData } from '../types/data';

export const useGetListSimpleTenant = () => {
    const { data, ...res } = useQuery({
        queryKey: tenantQueryKeys.list(),
        queryFn: () => tenantApi.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const tenantSimpleData = data?.data?.data ?? ([] as TenantData[]);

    return {
        tenantSimpleData,
        ...res,
    };
};
