import {
    ANALYTICS_GRANULARITY,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { AnalyticsScopeParams } from '../../types';
import { useGetSourceTypeRevenueDspBarChart } from '../../hooks/use-get-source-type-revenue-dsp-bar-chart';
import { useGetSourceTypeRevenueLineChart } from '../../hooks/use-get-source-type-revenue-line-chart';
import { useGetSourceTypeRevenueTerBarChart } from '../../hooks/use-get-source-type-revenue-ter-bar-chart';
import { useGetSourceTypeTrendViewDspBarChart } from '../../hooks/use-get-source-type-trend-view-dsp-bar-chart';
import { useGetSourceTypeTrendViewLineChart } from '../../hooks/use-get-source-type-trend-view-line-chart';
import { useGetSourceTypeTrendViewTerBarChart } from '../../hooks/use-get-source-type-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface SourceTypeAnalyticsOverviewChartProps {
    sourceType: string;
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

export default function SourceTypeAnalyticsOverviewChart({
    sourceType,
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
}: SourceTypeAnalyticsOverviewChartProps) {
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

    const isEnabled = enabled && !!sourceType;

    const {
        trendViewLineChartData,
        isFetching: isTrendViewLineFetching,
    } = useGetSourceTypeTrendViewLineChart(
        sourceType,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        trendViewDspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetSourceTypeTrendViewDspBarChart(
        sourceType,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        trendViewTerBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetSourceTypeTrendViewTerBarChart(
        sourceType,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData,
        isFetching: isRevenueLineFetching,
    } = useGetSourceTypeRevenueLineChart(
        sourceType,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData: dspRevenueData,
        isFetching: isDspRevenueFetching,
    } = useGetSourceTypeRevenueDspBarChart(
        sourceType,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetSourceTypeRevenueTerBarChart(
        sourceType,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const lineChartData = isRevenueMetric
        ? revenueLineChartData
        : trendViewLineChartData;
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
            overviewChartMode={overviewChartMode}
            onOverviewChartModeChange={onOverviewChartModeChange}
            granularity={granularity}
            onGranularityChange={onGranularityChange}
        />
    );
}
