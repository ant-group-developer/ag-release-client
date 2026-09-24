import {
    ANALYTICS_GRANULARITY,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { AnalyticsScopeParams } from '../../types';
import { useGetTrackRevenueDspBarChart } from '../../hooks/use-get-track-revenue-dsp-bar-chart';
import { useGetTrackRevenueLineChart } from '../../hooks/use-get-track-revenue-line-chart';
import { useGetTrackRevenueTerBarChart } from '../../hooks/use-get-track-revenue-ter-bar-chart';
import { useGetTrackTrendViewDspBarChart } from '../../hooks/use-get-track-trend-view-dsp-bar-chart';
import { useGetTrackTrendViewLineChart } from '../../hooks/use-get-track-trend-view-line-chart';
import { useGetTrackTrendViewTerBarChart } from '../../hooks/use-get-track-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface TrackAnalyticsOverviewChartProps {
    isrc: string;
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

export default function TrackAnalyticsOverviewChart({
    isrc,
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
}: TrackAnalyticsOverviewChartProps) {
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

    const isEnabled = enabled && !!isrc;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetTrackTrendViewLineChart(
        isrc,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetTrackTrendViewDspBarChart(
        isrc,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetTrackTrendViewTerBarChart(
        isrc,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData: revenueLineData,
        isFetching: isRevenueLineFetching,
    } = useGetTrackRevenueLineChart(
        isrc,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData: dspRevenueData,
        isFetching: isDspRevenueFetching,
    } = useGetTrackRevenueDspBarChart(
        isrc,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetTrackRevenueTerBarChart(
        isrc,
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
            overviewChartMode={overviewChartMode}
            onOverviewChartModeChange={onOverviewChartModeChange}
            granularity={granularity}
            onGranularityChange={onGranularityChange}
        />
    );
}
