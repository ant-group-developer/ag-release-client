import { defaultDataPagination } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder, OrderData } from '../types';

export const useGetOrderList = (params: DataFilterOrder) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getList, params],
        queryFn: () => orderApi.getList(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: true,
    });

    const dataOrder: PaginationResponse<OrderData>['data'] =
        data?.data?.data ?? defaultDataPagination;

    return {
        data: dataOrder,
        lastUpdatedTime: dayjs(res.dataUpdatedAt).format('HH:mm:ss'),
        ...res,
    };
};
