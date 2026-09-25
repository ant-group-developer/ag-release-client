import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import {
    TrendViewDspBarChartV2Item,
    TrendViewDspBarChartV2Params,
} from '../types';

export const useGetTrendViewDspBarChartV2 = (
    params: TrendViewDspBarChartV2Params,
    options: { enabled?: boolean } | boolean = true
) => {
    const queryOptions =
        typeof options === 'boolean' ? { enabled: options } : options;

    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.trendViewDspBarChartV2(params),
        queryFn: () => analytics2Apis.getTrendViewDspBarChartV2(params),
        placeholderData: (prev) => prev,
        ...queryOptions,
    });

    return {
        barChartData:
            data?.data?.data ?? ([] as TrendViewDspBarChartV2Item[]),
        ...res,
    };
};
