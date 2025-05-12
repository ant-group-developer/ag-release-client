import { defaultDataPagination } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';
import { ProductTypeData } from '../types';

export const useGetProductTypes = () => {
    const { data, ...res } = useQuery({
        queryKey: productTypesQueryKeys.getList,
        queryFn: () => productTypesApis.getList(),
    });

    const productTypesData: PaginationResponse<ProductTypeData>['data'] =
        data?.data?.data ?? defaultDataPagination;

    return {
        productTypesData,
        ...res,
    };
};
