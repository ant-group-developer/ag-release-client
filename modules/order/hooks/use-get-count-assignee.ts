import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder } from '../types';

export const useGetCountOrderAssignee = (
    dataFilter: DataFilterOrder,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCountAssignee, dataFilter],
        queryFn: () => orderApi.getAssigneeCount(dataFilter),
        enabled,
    });

    const defaultData: CommonDataSidebar[] = [];
    const countAssigneeData = data?.data?.data ?? defaultData;

    return {
        countAssigneeData,
        ...res,
    };
};
