import { defaultDataPagination } from '@/constants/common';
import { PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { prioritiesApi } from '../apis';
import { priorityQueryKeys } from '../constants';
import { PriorityData } from '../types';

export const useGetPriorityList = (enabled: boolean = true) => {
    const { data, ...rest } = useQuery({
        queryKey: [...priorityQueryKeys.getList],
        queryFn: () => prioritiesApi.getList(),
        enabled,
    });

    const priorityData: PaginationResponse<PriorityData>['data'] =
        data?.data?.data ?? defaultDataPagination;

    return {
        priorityData,
        ...rest,
    };
};
