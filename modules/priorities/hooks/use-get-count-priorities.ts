import { DataFilterOrder } from '@/modules/order/types';
import { useQuery } from '@tanstack/react-query';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';
import { PriorityCountData } from '../types';

export const useCountPriorities = (
    params?: DataFilterOrder,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: [...priorityQueryKeys.getCount, params],
        queryFn: () => prioritiesApi.getCountPriorities(params),
        enabled,
    });

    const defaultData: PriorityCountData[] = [];
    const countPrioritiesData = data?.data?.data ?? defaultData;

    return {
        countPrioritiesData,
        ...res,
    };
};
