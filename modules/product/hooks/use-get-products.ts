import { defaultDataPagination } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { DataFilterProduct, ProductData } from '../types';

export const useGetProductList = (params: DataFilterProduct) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getList, params],
        queryFn: () => productApi.getAll(params),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: true,
    });

    const dataResponse: PaginationResponse<ProductData>['data'] =
        data?.data.data ?? defaultDataPagination;

    return {
        lastUpdatedTime: dayjs(res.dataUpdatedAt).format('HH:mm:ss'),
        data: dataResponse,
        ...res,
    };
};
