import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetTenantRevenueDspBarChart } from '../../hooks/use-get-tenant-revenue-dsp-bar-chart';
import { useGetTenantRevenueLineChart } from '../../hooks/use-get-tenant-revenue-line-chart';
import { useGetTenantRevenueTerBarChart } from '../../hooks/use-get-tenant-revenue-ter-bar-chart';
import { useGetTenantTrendViewDspBarChart } from '../../hooks/use-get-tenant-trend-view-dsp-bar-chart';
import { useGetTenantTrendViewLineChart } from '../../hooks/use-get-tenant-trend-view-line-chart';
import { useGetTenantTrendViewTerBarChart } from '../../hooks/use-get-tenant-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface TenantAnalyticsOverviewChartProps {
    tenantId: string;
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
}

export default function TenantAnalyticsOverviewChart({
    tenantId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
}: TenantAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType,
    };

    const isEnabled = enabled && !!tenantId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetTenantTrendViewLineChart(
        tenantId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetTenantTrendViewDspBarChart(
        tenantId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetTenantTrendViewTerBarChart(
        tenantId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData,
        isFetching: isRevenueLineFetching,
    } = useGetTenantRevenueLineChart(
        tenantId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData: dspRevenueData,
        isFetching: isDspRevenueFetching,
    } = useGetTenantRevenueDspBarChart(
        tenantId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData: terRevenueData,
        isFetching: isTerRevenueFetching,
    } = useGetTenantRevenueTerBarChart(
        tenantId,
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
