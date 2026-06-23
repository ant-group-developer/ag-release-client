import { QUERY_KEY } from '@/constants/query-key';
import {
    DspTimelineParams,
    RankingParams,
    ReleaseOverviewParams,
    RevenueDspBarChartParams,
    RevenueLineChartParams,
    RevenueQueryParams,
    RevenueTerBarChartParams,
    TerTimelineParams,
    TrendViewDspBarChartParams,
    TrendViewLineChartParams,
    TrendViewSummaryParams,
    TrendViewTerBarChartParams,
} from '../types';

export const analytics2QueryKeys = {
    all: [QUERY_KEY.ANALYTICS2.KEY] as const,
    dspTimeline: (params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TIMELINE,
            params,
        ] as const,
    terTimeline: (params: TerTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TER_TIMELINE,
            params,
        ] as const,
    trendViewSummary: (params: TrendViewSummaryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_SUMMARY,
            params,
        ] as const,
    trendViewLineChart: (params: TrendViewLineChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_LINE_CHART,
            params,
        ] as const,
    trendViewDspBarChart: (params: TrendViewDspBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_DSP_BAR_CHART,
            params,
        ] as const,
    trendViewTerBarChart: (params: TrendViewTerBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_TER_BAR_CHART,
            params,
        ] as const,
    dspSalesTimeline: (params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_SALES_TIMELINE,
            params,
        ] as const,
    dspDailyTimeline: (params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_DAILY_TIMELINE,
            params,
        ] as const,
    trackRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_RANKING,
            params,
        ] as const,
    releaseRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_RANKING,
            params,
        ] as const,
    artistRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_RANKING,
            params,
        ] as const,
    labelRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_RANKING,
            params,
        ] as const,
    tenantRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_RANKING,
            params,
        ] as const,
    dspRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_RANKING,
            params,
        ] as const,
    syncJob: (jobId?: string) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SYNC_JOB,
            jobId,
        ] as const,
    revenueSummary: (params: { fromDate: string; toDate: string }) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_SUMMARY,
            params,
        ] as const,
    revenueLineChart: (params: RevenueLineChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_LINE_CHART,
            params,
        ] as const,
    revenueDspBarChart: (params: RevenueDspBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_DSP_BAR_CHART,
            params,
        ] as const,
    revenueTerBarChart: (params: RevenueTerBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TER_BAR_CHART,
            params,
        ] as const,
    revenueTimeline: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TIMELINE,
            params,
        ] as const,
    revenueTopDsp: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_DSP,
            params,
        ] as const,
    revenueTopTenant: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_TENANT,
            params,
        ] as const,
    revenueTopArtist: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_ARTIST,
            params,
        ] as const,
    revenueTopTrack: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_TRACK,
            params,
        ] as const,
    revenueTopRelease: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_RELEASE,
            params,
        ] as const,
    revenueTopLabel: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_LABEL,
            params,
        ] as const,
    releaseOverview: (releaseId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_OVERVIEW,
            releaseId,
            params,
        ] as const,
    releaseDspTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_DSP_TIMELINE,
            releaseId,
            params,
        ] as const,
    releaseDspSalesTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_DSP_SALES_TIMELINE,
            releaseId,
            params,
        ] as const,
    releaseDspDailyTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_DSP_DAILY_TIMELINE,
            releaseId,
            params,
        ] as const,
    releaseRevenueTimeline: (releaseId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_REVENUE_TIMELINE,
            releaseId,
            params,
        ] as const,
    releaseTrendViewLineChart: (
        releaseId: string,
        params: TrendViewLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_TREND_VIEW_LINE_CHART,
            releaseId,
            params,
        ] as const,
    releaseTrendViewDspBarChart: (
        releaseId: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_TREND_VIEW_DSP_BAR_CHART,
            releaseId,
            params,
        ] as const,
    releaseTrendViewTerBarChart: (
        releaseId: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_TREND_VIEW_TER_BAR_CHART,
            releaseId,
            params,
        ] as const,
    releaseRevenueLineChart: (
        releaseId: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_REVENUE_LINE_CHART,
            releaseId,
            params,
        ] as const,
    releaseRevenueDspBarChart: (
        releaseId: string,
        params: RevenueDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_REVENUE_DSP_BAR_CHART,
            releaseId,
            params,
        ] as const,
    releaseRevenueTerBarChart: (
        releaseId: string,
        params: RevenueTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_REVENUE_TER_BAR_CHART,
            releaseId,
            params,
        ] as const,
    trackOverview: (isrc: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_OVERVIEW,
            isrc,
            params,
        ] as const,
    trackRevenueLineChart: (isrc: string, params: RevenueLineChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_REVENUE_LINE_CHART,
            isrc,
            params,
        ] as const,
    trackRevenueDspBarChart: (isrc: string, params: RevenueDspBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_REVENUE_DSP_BAR_CHART,
            isrc,
            params,
        ] as const,
    trackRevenueTerBarChart: (isrc: string, params: RevenueTerBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_REVENUE_TER_BAR_CHART,
            isrc,
            params,
        ] as const,
    trackTrendViewLineChart: (isrc: string, params: TrendViewLineChartParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_TREND_VIEW_LINE_CHART,
            isrc,
            params,
        ] as const,
    trackTrendViewDspBarChart: (
        isrc: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_TREND_VIEW_DSP_BAR_CHART,
            isrc,
            params,
        ] as const,
    trackTrendViewTerBarChart: (
        isrc: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_TREND_VIEW_TER_BAR_CHART,
            isrc,
            params,
        ] as const,
    trackDspTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_DSP_TIMELINE,
            isrc,
            params,
        ] as const,
    trackDspSalesTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_DSP_SALES_TIMELINE,
            isrc,
            params,
        ] as const,
    trackDspDailyTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_DSP_DAILY_TIMELINE,
            isrc,
            params,
        ] as const,
    trackRevenueTimeline: (isrc: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_REVENUE_TIMELINE,
            isrc,
            params,
        ] as const,
    labelOverview: (labelId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_OVERVIEW,
            labelId,
            params,
        ] as const,
    labelDspTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_DSP_TIMELINE,
            labelId,
            params,
        ] as const,
    labelDspSalesTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_DSP_SALES_TIMELINE,
            labelId,
            params,
        ] as const,
    labelDspDailyTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_DSP_DAILY_TIMELINE,
            labelId,
            params,
        ] as const,
    labelRevenueTimeline: (labelId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_REVENUE_TIMELINE,
            labelId,
            params,
        ] as const,
    labelTrendViewLineChart: (
        labelId: string,
        params: TrendViewLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TREND_VIEW_LINE_CHART,
            labelId,
            params,
        ] as const,
    labelTrendViewDspBarChart: (
        labelId: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TREND_VIEW_DSP_BAR_CHART,
            labelId,
            params,
        ] as const,
    labelTrendViewTerBarChart: (
        labelId: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TREND_VIEW_TER_BAR_CHART,
            labelId,
            params,
        ] as const,
    labelRevenueLineChart: (
        labelId: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_REVENUE_LINE_CHART,
            labelId,
            params,
        ] as const,
    labelRevenueDspBarChart: (
        labelId: string,
        params: RevenueDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_REVENUE_DSP_BAR_CHART,
            labelId,
            params,
        ] as const,
    labelRevenueTerBarChart: (
        labelId: string,
        params: RevenueTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_REVENUE_TER_BAR_CHART,
            labelId,
            params,
        ] as const,
    artistOverview: (artistId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_OVERVIEW,
            artistId,
            params,
        ] as const,
    artistDspTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_DSP_TIMELINE,
            artistId,
            params,
        ] as const,
    artistDspSalesTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_DSP_SALES_TIMELINE,
            artistId,
            params,
        ] as const,
    artistDspDailyTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_DSP_DAILY_TIMELINE,
            artistId,
            params,
        ] as const,
    artistRevenueTimeline: (artistId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_REVENUE_TIMELINE,
            artistId,
            params,
        ] as const,
    artistTrendViewLineChart: (
        artistId: string,
        params: TrendViewLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TREND_VIEW_LINE_CHART,
            artistId,
            params,
        ] as const,
    artistTrendViewDspBarChart: (
        artistId: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TREND_VIEW_DSP_BAR_CHART,
            artistId,
            params,
        ] as const,
    artistTrendViewTerBarChart: (
        artistId: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TREND_VIEW_TER_BAR_CHART,
            artistId,
            params,
        ] as const,
    artistRevenueLineChart: (
        artistId: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_REVENUE_LINE_CHART,
            artistId,
            params,
        ] as const,
    artistRevenueDspBarChart: (
        artistId: string,
        params: RevenueDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_REVENUE_DSP_BAR_CHART,
            artistId,
            params,
        ] as const,
    artistRevenueTerBarChart: (
        artistId: string,
        params: RevenueTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_REVENUE_TER_BAR_CHART,
            artistId,
            params,
        ] as const,
    tenantOverview: (tenantId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_OVERVIEW,
            tenantId,
            params,
        ] as const,
    tenantTrendViewLineChart: (
        tenantId: string,
        params: TrendViewLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TREND_VIEW_LINE_CHART,
            tenantId,
            params,
        ] as const,
    tenantTrendViewDspBarChart: (
        tenantId: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TREND_VIEW_DSP_BAR_CHART,
            tenantId,
            params,
        ] as const,
    tenantTrendViewTerBarChart: (
        tenantId: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TREND_VIEW_TER_BAR_CHART,
            tenantId,
            params,
        ] as const,
    tenantRevenueLineChart: (
        tenantId: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_REVENUE_LINE_CHART,
            tenantId,
            params,
        ] as const,
    tenantRevenueDspBarChart: (
        tenantId: string,
        params: RevenueDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_REVENUE_DSP_BAR_CHART,
            tenantId,
            params,
        ] as const,
    tenantRevenueTerBarChart: (
        tenantId: string,
        params: RevenueTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_REVENUE_TER_BAR_CHART,
            tenantId,
            params,
        ] as const,
};
