import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    TrendViewTerBarChartItem,
    TrendViewTerBarChartV2Params,
} from '../types';

export const useGetTrendViewTerBarChartV2 = (
    params: TrendViewTerBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewTerBarChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewTerBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        barChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
