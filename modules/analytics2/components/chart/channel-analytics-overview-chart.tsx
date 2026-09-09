import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { AnalyticsScopeParams } from '../../types';
import { useGetChannelRevenueDspBarChart } from '../../hooks/use-get-channel-revenue-dsp-bar-chart';
import { useGetChannelRevenueLineChart } from '../../hooks/use-get-channel-revenue-line-chart';
import { useGetChannelRevenueTerBarChart } from '../../hooks/use-get-channel-revenue-ter-bar-chart';
import { useGetChannelTrendViewDspBarChart } from '../../hooks/use-get-channel-trend-view-dsp-bar-chart';
import { useGetChannelTrendViewLineChart } from '../../hooks/use-get-channel-trend-view-line-chart';
import { useGetChannelTrendViewTerBarChart } from '../../hooks/use-get-channel-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface ChannelAnalyticsOverviewChartProps {
    channelId: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
    scopeParams?: AnalyticsScopeParams;
}

export default function ChannelAnalyticsOverviewChart({
    channelId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
    scopeParams,
}: ChannelAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType,
        ...scopeParams,
    };

    const isEnabled = enabled && !!channelId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetChannelTrendViewLineChart(
        channelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetChannelTrendViewDspBarChart(
        channelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetChannelTrendViewTerBarChart(
        channelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        lineChartData: revenueLineData,
        isFetching: isRevenueLineFetching,
    } = useGetChannelRevenueLineChart(
        channelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        dspBarChartData: dspRevenueData,
        isFetching: isDspRevenueFetching,
    } = useGetChannelRevenueDspBarChart(
        channelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        terBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetChannelRevenueTerBarChart(
        channelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const lineChartData = isRevenueMetric
        ? revenueLineData
        : trendViewLineData;
    const isLineChartLoading = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const dspData = isRevenueMetric
        ? dspRevenueData
        : dspTrendViewData;
    const terData = isRevenueMetric
        ? terRevenueData
        : terTrendViewData;
    const isBarChartLoading = isRevenueMetric
        ? isDspRevenueFetching || isTerRevenueFetching
        : isDspTrendViewFetching || isTerTrendViewFetching;

    return (
        <AnalyticsOverviewChart
            activeMetric={activeMetric}
            lineChartData={lineChartData}
            isLineChartLoading={isLineChartLoading}
            dspData={dspData}
            terData={terData}
            isBarChartLoading={isBarChartLoading}
        />
    );
}
