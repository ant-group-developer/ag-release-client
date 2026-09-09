import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { AnalyticsScopeParams } from '../../types';
import { useGetLabelRevenueDspBarChart } from '../../hooks/use-get-label-revenue-dsp-bar-chart';
import { useGetLabelRevenueLineChart } from '../../hooks/use-get-label-revenue-line-chart';
import { useGetLabelRevenueTerBarChart } from '../../hooks/use-get-label-revenue-ter-bar-chart';
import { useGetLabelTrendViewDspBarChart } from '../../hooks/use-get-label-trend-view-dsp-bar-chart';
import { useGetLabelTrendViewLineChart } from '../../hooks/use-get-label-trend-view-line-chart';
import { useGetLabelTrendViewTerBarChart } from '../../hooks/use-get-label-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface LabelAnalyticsOverviewChartProps {
    labelId: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
    scopeParams?: AnalyticsScopeParams;
}

export default function LabelAnalyticsOverviewChart({
    labelId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
    scopeParams,
}: LabelAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType,
        ...scopeParams,
    };

    const isEnabled = enabled && !!labelId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetLabelTrendViewLineChart(
        labelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetLabelTrendViewDspBarChart(
        labelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetLabelTrendViewTerBarChart(
        labelId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData,
        isFetching: isRevenueLineFetching,
    } = useGetLabelRevenueLineChart(
        labelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData,
        isFetching: isDspRevenueFetching,
    } = useGetLabelRevenueDspBarChart(
        labelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData,
        isFetching: isTerRevenueFetching,
    } = useGetLabelRevenueTerBarChart(
        labelId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

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
