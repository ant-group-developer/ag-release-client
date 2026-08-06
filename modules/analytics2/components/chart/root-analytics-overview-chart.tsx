import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetRevenueDspBarChart } from '../../hooks/use-get-revenue-dsp-bar-chart';
import { useGetRevenueLineChart } from '../../hooks/use-get-revenue-line-chart';
import { useGetRevenueTerBarChart } from '../../hooks/use-get-revenue-ter-bar-chart';
import { useGetTrendViewDspBarChart } from '../../hooks/use-get-trend-view-dsp-bar-chart';
import { useGetTrendViewLineChart } from '../../hooks/use-get-trend-view-line-chart';
import { useGetTrendViewTerBarChart } from '../../hooks/use-get-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface RootAnalyticsOverviewChartProps {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
}

export default function RootAnalyticsOverviewChart({
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
}: RootAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType,
    };

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetTrendViewLineChart(chartFilterParams, {
        enabled: enabled && !isRevenueMetric,
    });

    const {
        barChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetTrendViewDspBarChart(chartFilterParams, {
        enabled: enabled && !isRevenueMetric,
    });

    const {
        barChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetTrendViewTerBarChart(chartFilterParams, {
        enabled: enabled && !isRevenueMetric,
    });

    const { revenueLineChartData, isFetching: isRevenueLineFetching } =
        useGetRevenueLineChart(chartFilterParams, {
            enabled: enabled && isRevenueMetric,
        });

    const { revenueDspBarChartData, isFetching: isDspRevenueFetching } =
        useGetRevenueDspBarChart(chartFilterParams, {
            enabled: enabled && isRevenueMetric,
        });

    const { revenueTerBarChartData, isFetching: isTerRevenueFetching } =
        useGetRevenueTerBarChart(chartFilterParams, {
            enabled: enabled && isRevenueMetric,
        });

    const lineChartData = isRevenueMetric
        ? revenueLineChartData
        : trendViewLineData;
    const isLineChartLoading = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const dspData = isRevenueMetric
        ? revenueDspBarChartData
        : dspTrendViewData;
    const terData = isRevenueMetric
        ? revenueTerBarChartData
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
