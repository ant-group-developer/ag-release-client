import {
    ANALYTICS_BAR_CHART_TYPE,
    ANALYTICS_METRIC_KEY,
    ANALYTICS_RELEASE_TYPE,
} from '../../enums';
import { useGetDspRevenueLineChart } from '../../hooks/use-get-dsp-revenue-line-chart';
import { useGetDspRevenueTenantBarChart } from '../../hooks/use-get-dsp-revenue-tenant-bar-chart';
import { useGetDspRevenueTerBarChart } from '../../hooks/use-get-dsp-revenue-ter-bar-chart';
import { useGetDspTrendViewLineChart } from '../../hooks/use-get-dsp-trend-view-line-chart';
import { useGetDspTrendViewTenantBarChart } from '../../hooks/use-get-dsp-trend-view-tenant-bar-chart';
import { useGetDspTrendViewTerBarChart } from '../../hooks/use-get-dsp-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface DspAnalyticsOverviewChartProps {
    pgDspId: string;
    dspReportId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
}

export default function DspAnalyticsOverviewChart({
    pgDspId,
    dspReportId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
}: DspAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        pgDspId,
        dspReportId,
        fromDate,
        toDate,
        releaseType: releaseType as any,
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
        tenantBarChartData: tenantTrendViewData,
        isFetching: isTenantTrendViewFetching,
    } = useGetDspTrendViewTenantBarChart(
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetDspTrendViewTerBarChart(
        chartFilterParams,
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
        tenantBarChartData: tenantRevenueData,
        isFetching: isTenantRevenueFetching,
    } = useGetDspRevenueTenantBarChart(
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        terBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetDspRevenueTerBarChart(
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
        ? tenantRevenueData
        : tenantTrendViewData;
    const terData = isRevenueMetric
        ? terRevenueData
        : terTrendViewData;
    const isBarChartLoading = isRevenueMetric
        ? isTenantRevenueFetching || isTerRevenueFetching
        : isTenantTrendViewFetching || isTerTrendViewFetching;

    return (
        <AnalyticsOverviewChart
            activeMetric={activeMetric}
            lineChartData={lineChartData}
            isLineChartLoading={isLineChartLoading}
            dspData={dspData}
            terData={terData}
            isBarChartLoading={isBarChartLoading}
            showSegment={false}
            defaultBarChartType={ANALYTICS_BAR_CHART_TYPE.TERRITORY}
        />
    );
}
