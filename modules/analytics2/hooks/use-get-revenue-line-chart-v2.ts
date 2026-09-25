import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartV2Params } from '../types';

export const useGetRevenueLineChartV2 = (
    params: RevenueLineChartV2Params,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.revenueLineChartV2(params),
        queryFn: () => analytics2Apis.getRevenueLineChartV2(params),
        placeholderData: (prev) => prev,
        ...options,
    });

    return {
        lineChartSeries: data?.data?.data?.series ?? [],
        seriesBy: data?.data?.data?.seriesBy,
        ...res,
    };
};
