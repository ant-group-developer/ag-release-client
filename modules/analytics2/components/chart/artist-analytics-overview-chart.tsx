import { ANALYTICS_METRIC_KEY, ANALYTICS_RELEASE_TYPE } from '../../enums';
import { useGetArtistRevenueDspBarChart } from '../../hooks/use-get-artist-revenue-dsp-bar-chart';
import { useGetArtistRevenueLineChart } from '../../hooks/use-get-artist-revenue-line-chart';
import { useGetArtistRevenueTerBarChart } from '../../hooks/use-get-artist-revenue-ter-bar-chart';
import { useGetArtistTrendViewDspBarChart } from '../../hooks/use-get-artist-trend-view-dsp-bar-chart';
import { useGetArtistTrendViewLineChart } from '../../hooks/use-get-artist-trend-view-line-chart';
import { useGetArtistTrendViewTerBarChart } from '../../hooks/use-get-artist-trend-view-ter-bar-chart';
import AnalyticsOverviewChart from './analytics-overview-chart';

export interface ArtistAnalyticsOverviewChartProps {
    artistId: string;
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    activeMetric?: string;
    enabled?: boolean;
}

export default function ArtistAnalyticsOverviewChart({
    artistId,
    fromDate,
    toDate,
    releaseType,
    activeMetric = ANALYTICS_METRIC_KEY.TOTAL_VIEWS,
    enabled = true,
}: ArtistAnalyticsOverviewChartProps) {
    const isRevenueMetric =
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_USAGE ||
        activeMetric === ANALYTICS_METRIC_KEY.TOTAL_REVENUE_USD;

    const chartFilterParams = {
        fromDate,
        toDate,
        releaseType: releaseType as any,
    };

    const isEnabled = enabled && !!artistId;

    const {
        lineChartData: trendViewLineData,
        isFetching: isTrendViewLineFetching,
    } = useGetArtistTrendViewLineChart(
        artistId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        dspBarChartData: dspTrendViewData,
        isFetching: isDspTrendViewFetching,
    } = useGetArtistTrendViewDspBarChart(
        artistId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        terBarChartData: terTrendViewData,
        isFetching: isTerTrendViewFetching,
    } = useGetArtistTrendViewTerBarChart(
        artistId,
        chartFilterParams,
        isEnabled && !isRevenueMetric
    );

    const {
        revenueLineChartData,
        isFetching: isRevenueLineFetching,
    } = useGetArtistRevenueLineChart(
        artistId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueDspBarChartData,
        isFetching: isDspRevenueFetching,
    } = useGetArtistRevenueDspBarChart(
        artistId,
        chartFilterParams,
        isEnabled && isRevenueMetric
    );

    const {
        revenueTerBarChartData,
        isFetching: isTerRevenueFetching,
    } = useGetArtistRevenueTerBarChart(
        artistId,
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
