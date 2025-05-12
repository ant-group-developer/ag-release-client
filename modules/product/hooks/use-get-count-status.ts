import { StatusCountData } from '@/modules/order/types';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { DataFilterProduct } from '../types';

export const useGetCountProductStatus = (
    dataFilter: DataFilterProduct,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getCountStatus, dataFilter],
        queryFn: () => productApi.getCountStatus(dataFilter),
        enabled,
    });

    const defaultData: StatusCountData[] = [];
    const countStatusData = data?.data?.data ?? defaultData;

    return {
        countStatusData,
        ...res,
    };
};
