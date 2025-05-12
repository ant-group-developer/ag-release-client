import { useQuery } from '@tanstack/react-query';
import { orderManagementApis } from '../apis';
import { orderManagementQueryKeys } from '../constants';
import { FilterOrderManagement, OrderManagementData } from '../types';

export const useGetOrderManagement = (filter: FilterOrderManagement) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderManagementQueryKeys.getList, filter],
        queryFn: () => orderManagementApis.getList(filter),
    });

    const defaultData: OrderManagementData[] = [];
    const orderManagementData = data?.data?.data ?? defaultData;

    return {
        orderManagementData,
        ...res,
    };
};
