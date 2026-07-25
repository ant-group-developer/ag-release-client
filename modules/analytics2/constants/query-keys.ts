import { QUERY_KEY } from '@/constants/query-key';

import {
    AnalyticsCommonParams,
    DspDetailParams,
    DspRankingParams,
    DspTimelineParams,
    RankingParams,
    ReleaseOverviewParams,
    RevenueDspBarChartParams,
    RevenueLineChartParams,
    RevenueQueryParams,
    RevenueTerBarChartParams,
    TerTimelineParams,
    TrendViewDspBarChartParams,
    TrendViewTerBarChartParams,
} from '../types';

export const analytics2QueryKeys = {
    all: [QUERY_KEY.ANALYTICS2.KEY] as const,
    analyticsSummary: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ANALYTICS_SUMMARY,
            params,
        ] as const,
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
    trendViewSummary: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_SUMMARY,
            params,
        ] as const,
    trendViewLineChart: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_LINE_CHART,
            params,
        ] as const,
    trendViewDspBarChart: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TREND_VIEW_DSP_BAR_CHART,
            params,
        ] as const,
    trendViewTerBarChart: (params: AnalyticsCommonParams) =>
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
    releaseVideoRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_VIDEO_RANKING,
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
    channelRanking: (params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_RANKING,
            params,
        ] as const,
    syncJob: (jobId?: string) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SYNC_JOB,
            jobId,
        ] as const,
    revenueSummary: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_SUMMARY,
            params,
        ] as const,
    revenueLineChart: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_LINE_CHART,
            params,
        ] as const,
    revenueDspBarChart: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_DSP_BAR_CHART,
            params,
        ] as const,
    revenueTerBarChart: (params: AnalyticsCommonParams) =>
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
    revenueTopReleaseVideo: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_RELEASE_VIDEO,
            params,
        ] as const,
    revenueTopLabel: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_LABEL,
            params,
        ] as const,
    revenueTopChannel: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_CHANNEL,
            params,
        ] as const,
    revenueTopSourceType: (params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.REVENUE_TOP_SOURCE_TYPE,
            params,
        ] as const,
    releaseOverview: (releaseId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_OVERVIEW,
            releaseId,
            params,
        ] as const,
    releaseSummary: (releaseId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_SUMMARY,
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
    releaseDsp: (releaseId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_DSP,
            releaseId,
            params,
        ] as const,
    releaseTer: (releaseId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.RELEASE_TER,
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
        params: AnalyticsCommonParams
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
        params: AnalyticsCommonParams
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
    trackSummary: (isrc: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_SUMMARY,
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
    trackTrendViewLineChart: (isrc: string, params: AnalyticsCommonParams) =>
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
    trackDsp: (isrc: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_DSP,
            isrc,
            params,
        ] as const,
    trackTer: (isrc: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TRACK_TER,
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
    labelSummary: (labelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_SUMMARY,
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
    labelTrendViewLineChart: (labelId: string, params: AnalyticsCommonParams) =>
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
    labelRevenueLineChart: (labelId: string, params: RevenueLineChartParams) =>
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
    labelTopReleases: (labelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TOP_RELEASES,
            labelId,
            params,
        ] as const,
    labelTopTracks: (labelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TOP_TRACKS,
            labelId,
            params,
        ] as const,
    labelDsp: (labelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_DSP,
            labelId,
            params,
        ] as const,
    labelTer: (labelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.LABEL_TER,
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
    artistSummary: (artistId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_SUMMARY,
            artistId,
            params,
        ] as const,
    artistTopReleases: (artistId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TOP_RELEASES,
            artistId,
            params,
        ] as const,
    artistTopTracks: (artistId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TOP_TRACKS,
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
        params: AnalyticsCommonParams
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
    artistDsp: (artistId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_DSP,
            artistId,
            params,
        ] as const,
    artistTer: (artistId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.ARTIST_TER,
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
    tenantSummary: (tenantId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_SUMMARY,
            tenantId,
            params,
        ] as const,
    tenantTopReleases: (tenantId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TOP_RELEASES,
            tenantId,
            params,
        ] as const,
    tenantTopTracks: (tenantId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TOP_TRACKS,
            tenantId,
            params,
        ] as const,
    tenantTrendViewLineChart: (
        tenantId: string,
        params: AnalyticsCommonParams
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
    tenantDsp: (tenantId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_DSP,
            tenantId,
            params,
        ] as const,
    tenantTer: (tenantId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.TENANT_TER,
            tenantId,
            params,
        ] as const,
    channelOverview: (channelId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_OVERVIEW,
            channelId,
            params,
        ] as const,
    channelTopReleases: (channelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_TOP_RELEASES,
            channelId,
            params,
        ] as const,
    channelTrendViewLineChart: (
        channelId: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_TREND_VIEW_LINE_CHART,
            channelId,
            params,
        ] as const,
    channelTrendViewDspBarChart: (
        channelId: string,
        params: TrendViewDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_TREND_VIEW_DSP_BAR_CHART,
            channelId,
            params,
        ] as const,
    channelTrendViewTerBarChart: (
        channelId: string,
        params: TrendViewTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_TREND_VIEW_TER_BAR_CHART,
            channelId,
            params,
        ] as const,
    channelRevenueLineChart: (
        channelId: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_REVENUE_LINE_CHART,
            channelId,
            params,
        ] as const,
    channelRevenueDspBarChart: (
        channelId: string,
        params: RevenueDspBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_REVENUE_DSP_BAR_CHART,
            channelId,
            params,
        ] as const,
    channelRevenueTerBarChart: (
        channelId: string,
        params: RevenueTerBarChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_REVENUE_TER_BAR_CHART,
            channelId,
            params,
        ] as const,
    channelDsp: (channelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_DSP,
            channelId,
            params,
        ] as const,
    channelTer: (channelId: string, params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.CHANNEL_TER,
            channelId,
            params,
        ] as const,
    dspOverview: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_OVERVIEW,

            params,
        ] as const,
    dspSummary: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_SUMMARY,

            params,
        ] as const,
    dspTopReleases: (params: DspRankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TOP_RELEASES,
            params,
        ] as const,
    dspTopTracks: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TOP_TRACKS,
            params,
        ] as const,
    dspTrendViewLineChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TREND_VIEW_LINE_CHART,

            params,
        ] as const,
    dspTrendViewTerBarChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TREND_VIEW_TER_BAR_CHART,
            params,
        ] as const,
    dspTrendViewTenantBarChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_TREND_VIEW_TENANT_BAR_CHART,
            params,
        ] as const,
    dspRevenueLineChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_REVENUE_LINE_CHART,

            params,
        ] as const,
    dspRevenueTerBarChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_REVENUE_TER_BAR_CHART,
            params,
        ] as const,
    dspRevenueTenantBarChart: (params: DspDetailParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.DSP_REVENUE_TENANT_BAR_CHART,
            params,
        ] as const,
    sourceTypeOverview: (sourceType: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_OVERVIEW,
            sourceType,
            params,
        ] as const,
    sourceTypeSummary: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_SUMMARY,
            sourceType,
            params,
        ] as const,
    sourceTypeTopReleases: (sourceType: string, params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_TOP_RELEASES,
            sourceType,
            params,
        ] as const,
    sourceTypeTopTracks: (sourceType: string, params: RankingParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_TOP_TRACKS,
            sourceType,
            params,
        ] as const,
    sourceTypeRevenueLineChart: (
        sourceType: string,
        params: RevenueLineChartParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_REVENUE_LINE_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeTrendViewLineChart: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_TREND_VIEW_LINE_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeRevenueDspBarChart: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_REVENUE_DSP_BAR_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeRevenueTerBarChart: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_REVENUE_TER_BAR_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeTrendViewDspBarChart: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_TREND_VIEW_DSP_BAR_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeTrendViewTerBarChart: (
        sourceType: string,
        params: AnalyticsCommonParams
    ) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_TREND_VIEW_TER_BAR_CHART,
            sourceType,
            params,
        ] as const,
    sourceTypeRanking: (params: AnalyticsCommonParams) =>
        [
            ...analytics2QueryKeys.all,
            QUERY_KEY.ANALYTICS2.SOURCE_TYPE_RANKING,
            params,
        ] as const,
};
