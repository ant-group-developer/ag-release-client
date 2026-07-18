import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { RevenueLineChartItem, RevenueLineChartParams } from '../types';

export const useGetChannelRevenueLineChart = (
    channelId: string,
    params: RevenueLineChartParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.channelRevenueLineChart(channelId, params),
        queryFn: () => analytics2Apis.getChannelRevenueLineChart(channelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!channelId,
    });

    return {
        lineChartData: data?.data?.data ?? ([] as RevenueLineChartItem[]),
        ...res,
    };
};
