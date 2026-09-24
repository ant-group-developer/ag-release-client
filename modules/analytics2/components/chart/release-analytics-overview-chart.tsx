import {
    ANALYTICS_GRANULARITY,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { AnalyticsScopeParams } from '../../types';
import { useGetReleaseRevenueDspBarChart } from '../../hooks/use-get-release-revenue-dsp-bar-chart';
import { useGetReleaseRevenueLineChart } from '../../hooks/use-get-release-revenue-line-chart';
import { useGetReleaseRevenueTerBarChart } from '../../hooks/use-get-release-revenue-ter-bar-chart';
import { useGetReleaseTrendViewDspBarChart } from '../../hooks/use-get-release-trend-view-dsp-bar-chart';
import { useGetReleaseTrendViewLineChart } from '../../hooks/use-get-release-trend-view-line-chart';
import { useGetReleaseTrendViewTerBarChart } from '../../hooks/use-get-release-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface ReleaseAnalyticsOverviewChartProps {
    releaseId: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
    scopeParams?: AnalyticsScopeParams;
    overviewChartMode?: ANALYTICS_OVERVIEW_CHART_MODE;
    onOverviewChartModeChange?: (mode: ANALYTICS_OVERVIEW_CHART_MODE) => void;
    granularity?: ANALYTICS_GRANULARITY;
    onGranularityChange?: (granularity: ANALYTICS_GRANULARITY) => void;
}

export default function ReleaseAnalyticsOverviewChart({
    releaseId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
    scopeParams,
    overviewChartMode,
    onOverviewChartModeChange,
    granularity,
    onGranularityChange,
}: ReleaseAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType,
        granularity,
        ...scopeParams,
    };

    const isEnabled = enabled && !!releaseId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetReleaseTrendViewLineChart(
        releaseId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetReleaseTrendViewDspBarChart(
        releaseId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetReleaseTrendViewTerBarChart(
        releaseId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData: revenueLineData,
        isFetching: isRevenueLineFetching,
    } = useGetReleaseRevenueLineChart(
        releaseId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData: dspRevenueData,
        isFetching: isDspRevenueFetching,
    } = useGetReleaseRevenueDspBarChart(
        releaseId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetReleaseRevenueTerBarChart(
        releaseId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const lineChartData = isRevenueMetric ? revenueLineData : trendViewLineData;
    const isLineChartLoading = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const dspData = isRevenueMetric ? dspRevenueData : dspTrendViewData;
    const terData = isRevenueMetric ? terRevenueData : terTrendViewData;
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
            overviewChartMode={overviewChartMode}
            onOverviewChartModeChange={onOverviewChartModeChange}
            granularity={granularity}
            onGranularityChange={onGranularityChange}
        />
    );
}
