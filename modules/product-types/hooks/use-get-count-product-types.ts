import { DataFilterOrder } from '@/modules/order/types';
import { useQuery } from '@tanstack/react-query';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';
import { ProductCountData } from '../types';

export const useCountProductTypes = (
    params?: DataFilterOrder,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productTypesQueryKeys.getCount, params],
        queryFn: () => productTypesApis.getCountProductTypes(),
        enabled,
    });

    const defaultData: ProductCountData[] = [];
    const countProductTypesData = data?.data?.data ?? defaultData;

    return {
        countProductTypesData,
        ...res,
    };
};
