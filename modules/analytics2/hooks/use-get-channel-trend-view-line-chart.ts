import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams, TrendViewLineChartItem } from '../types';

export const useGetChannelTrendViewLineChart = (
    channelId: string,
    params: AnalyticsCommonParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.channelTrendViewLineChart(
            channelId,
            params
        ),
        queryFn: () =>
            analytics2Apis.getChannelTrendViewLineChart(channelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!channelId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as TrendViewLineChartItem[]),
        ...res,
    };
};
