import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { TrendViewDspBarChartItem, TrendViewDspBarChartParams } from '../types';

export const useGetChannelTrendViewDspBarChart = (
    channelId: string,
    params: TrendViewDspBarChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.channelTrendViewDspBarChart(channelId, params),
        queryFn: () => analytics2Apis.getChannelTrendViewDspBarChart(channelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!channelId,
    });

    return {
        dspBarChartData: data?.data?.data ?? ([] as TrendViewDspBarChartItem[]),
        ...res,
    };
};
