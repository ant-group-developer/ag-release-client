import { useQuery } from '@tanstack/react-query';
import { productManagementApis } from '../apis';
import { productManagementQueryKeys } from '../constants';
import { FilterProductManagement, ProductManagementData } from '../types';

export const useGetProductManagement = (filter: FilterProductManagement) => {
    const { data, ...res } = useQuery({
        queryKey: [...productManagementQueryKeys.getList, filter],
        queryFn: () => productManagementApis.getList(filter),
    });

    const defaultData: ProductManagementData[] = [];
    const productManagementData = data?.data?.data ?? defaultData;

    return {
        productManagementData,
        ...res,
    };
};
