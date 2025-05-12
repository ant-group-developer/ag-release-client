import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder } from '../types';

export const useGetCountOrderCreator = (
    dataFilter: DataFilterOrder,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCountCreator, dataFilter],
        queryFn: () => orderApi.getCreatorCount(dataFilter),
        enabled,
    });

    const defaultData: CommonDataSidebar[] = [];
    const countCreatorData = data?.data?.data ?? defaultData;

    return {
        countCreatorData,
        ...res,
    };
};
