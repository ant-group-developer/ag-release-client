import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { revenueApi } from '../apis';
import { trackRevenueQueryKeys } from '../constants/query-keys';
import { RevenueDataFilter } from '../types';

export const useGetListRevenue = (params: RevenueDataFilter) => {
    const { data, ...res } = useQuery({
        queryKey: trackRevenueQueryKeys.list(params),
        queryFn: () => revenueApi.getList(params),
        placeholderData: (prev) => prev,
    });

    const revenueData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        revenueData,
        ...res,
    };
};
