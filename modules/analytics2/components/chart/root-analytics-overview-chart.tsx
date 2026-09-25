import { useMemo, useState } from 'react';
import {
    ANALYTICS_GRANULARITY,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_OVERVIEW_CHART_MODE,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { getTrendViewLineChartV2Params } from '../../helpers';
import { useGetRevenueDspBarChart } from '../../hooks/use-get-revenue-dsp-bar-chart';
import { useGetRevenueLineChartV2 } from '../../hooks/use-get-revenue-line-chart-v2';
import { useGetRevenueTerBarChart } from '../../hooks/use-get-revenue-ter-bar-chart';
import { useGetTrendViewDspBarChart } from '../../hooks/use-get-trend-view-dsp-bar-chart';
import {
    mapTrendViewLineChartV2Series,
    useGetTrendViewLineChartV2,
} from '../../hooks/use-get-trend-view-line-chart-v2';
import { useGetTrendViewTerBarChart } from '../../hooks/use-get-trend-view-ter-bar-chart';
import { AnalyticsCommonParams, AnalyticsScopeParams } from '../../types';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface RootAnalyticsOverviewChartProps {
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

export default function RootAnalyticsOverviewChart({
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
    scopeParams,
    overviewChartMode: externalOverviewChartMode,
    onOverviewChartModeChange,
    granularity: externalGranularity,
    onGranularityChange,
}: RootAnalyticsOverviewChartProps) {
    const [internalOverviewChartMode, setInternalOverviewChartMode] =
        useState<ANALYTICS_OVERVIEW_CHART_MODE>(
            ANALYTICS_OVERVIEW_CHART_MODE.LINE
        );
    const [internalGranularity, setInternalGranularity] =
        useState<ANALYTICS_GRANULARITY>(ANALYTICS_GRANULARITY.DAY);

    const overviewChartMode =
        externalOverviewChartMode ?? internalOverviewChartMode;
    const handleOverviewChartModeChange =
        onOverviewChartModeChange ?? setInternalOverviewChartMode;

    const granularity = externalGranularity ?? internalGranularity;
    const handleGranularityChange =
        onGranularityChange ?? setInternalGranularity;

    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = useMemo<AnalyticsCommonParams>(
        () => ({
            fromDate,
            toDate,
            releaseType,
            granularity,
            ...scopeParams,
        }),
        [fromDate, granularity, releaseType, scopeParams, toDate]
    );

    const trendViewLineChartV2Params = useMemo(
        () => getTrendViewLineChartV2Params(chartFilterParams),
        [chartFilterParams]
    );

    const trendLineValueKey =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD
            ? 'revenueUsd'
            : activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE
              ? 'quantity'
              : 'totalViews';
    const {
        lineChartSeries: trendViewLineSeries,
        isFetching: isTrendViewLineFetching,
    } = useGetTrendViewLineChartV2(trendViewLineChartV2Params, {
        enabled: enabled && !isRevenueMetric,
    });
    const {
        lineChartSeries: revenueLineSeries,
        isFetching: isRevenueLineFetching,
    } = useGetRevenueLineChartV2(trendViewLineChartV2Params, {
        enabled: enabled && isRevenueMetric,
    });
    const activeLineSeries = isRevenueMetric
        ? revenueLineSeries
        : trendViewLineSeries;
    const trendViewLineChart = useMemo(
        () =>
            mapTrendViewLineChartV2Series(activeLineSeries, trendLineValueKey),
        [activeLineSeries, trendLineValueKey]
    );

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

    const { revenueDspBarChartData, isFetching: isDspRevenueFetching } =
        useGetRevenueDspBarChart(chartFilterParams, {
            enabled: enabled && isRevenueMetric,
        });

    const { revenueTerBarChartData, isFetching: isTerRevenueFetching } =
        useGetRevenueTerBarChart(chartFilterParams, {
            enabled: enabled && isRevenueMetric,
        });

    const lineChartData = trendViewLineChart.data;
    const lineChartLines = trendViewLineChart.lines;
    const isLineChartLoading = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const dspData = isRevenueMetric ? revenueDspBarChartData : dspTrendViewData;
    const terData = isRevenueMetric ? revenueTerBarChartData : terTrendViewData;
    const isBarChartLoading = isRevenueMetric
        ? isDspRevenueFetching || isTerRevenueFetching
        : isDspTrendViewFetching || isTerTrendViewFetching;

    return (
        <AnalyticsOverviewChart
            activeMetric={activeMetric}
            lineChartData={lineChartData}
            lineChartLines={lineChartLines}
            isLineChartLoading={isLineChartLoading}
            dspData={dspData}
            terData={terData}
            isBarChartLoading={isBarChartLoading}
            overviewChartMode={overviewChartMode}
            onOverviewChartModeChange={handleOverviewChartModeChange}
            granularity={granularity}
            onGranularityChange={handleGranularityChange}
        />
    );
}
