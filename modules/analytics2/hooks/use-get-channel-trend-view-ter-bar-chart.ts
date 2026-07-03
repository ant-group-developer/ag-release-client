import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewTerBarChartItem, TrendViewTerBarChartParams } from '../types';

export const useGetChannelTrendViewTerBarChart = (
    channelId: string,
    params: TrendViewTerBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.channelTrendViewTerBarChart(channelId, params),
        queryFn: () => analytics2Apis.getChannelTrendViewTerBarChart(channelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!channelId,
    });

    return {
        terBarChartData: data?.data?.data ?? ([] as TrendViewTerBarChartItem[]),
        ...res,
    };
};
