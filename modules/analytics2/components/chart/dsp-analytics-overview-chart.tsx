import { ANALYTIC_SORT_BY } from '@/enums/common';
import { useMemo } from 'react';
import {
    ANALYTICS_BAR_CHART_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { useGetDspRevenueLineChart } from '../../hooks/use-get-dsp-revenue-line-chart';
import { useGetDspRevenueTerBarChart } from '../../hooks/use-get-dsp-revenue-ter-bar-chart';
import { useGetDspTrendViewLineChart } from '../../hooks/use-get-dsp-trend-view-line-chart';
import { useGetDspTrendViewTerBarChart } from '../../hooks/use-get-dsp-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface DspAnalyticsOverviewChartProps {
    pgDspId: string;
    dspReportId: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    sortBy?: string;
    enabled?: boolean;
}

export default function DspAnalyticsOverviewChart({
    pgDspId,
    dspReportId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    sortBy,
    enabled = true,
}: DspAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const currentSortBy = useMemo(() => {
        if (sortBy) return sortBy;
        if (activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE) {
            return ANALYTIC_SORT_BY.USAGE;
        }
        if (activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD) {
            return ANALYTIC_SORT_BY.REVENUE;
        }
        return ANALYTIC_SORT_BY.VIEWS;
    }, [activeMetric, sortBy]);

    const chartFilterParams = {
        pgDspId,
        dspReportId,
        fromDate,
        toDate,
        releaseType,
    };

    const barChartFilterParams = {
        ...chartFilterParams,
        sortBy: currentSortBy,
    };

    const isEnabled = enabled && !!pgDspId && !!dspReportId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetDspTrendViewLineChart(
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetDspTrendViewTerBarChart(
        barChartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        lineChartData: revenueLineData,
        isFetching: isRevenueLineFetching,
    } = useGetDspRevenueLineChart(
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        terBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetDspRevenueTerBarChart(
        barChartFilterParams,
        isEnabled && isRevenueMetric
    );

    const lineChartData = isRevenueMetric
        ? revenueLineData
        : trendViewLineData;
    const isLineChartLoading = isRevenueMetric
        ? isRevenueLineFetching
        : isTrendViewLineFetching;

    const terData = isRevenueMetric
        ? terRevenueData
        : terTrendViewData;
    const isBarChartLoading = isRevenueMetric
        ? isTerRevenueFetching
        : isTerTrendViewFetching;

    return (
        <AnalyticsOverviewChart
            activeMetric={activeMetric}
            lineChartData={lineChartData}
            isLineChartLoading={isLineChartLoading}
            terData={terData}
            isBarChartLoading={isBarChartLoading}
            showSegment={false}
            defaultBarChartType={ANALYTICS_BAR_CHART_TYPE.TERRITORY}
        />
    );
}
