import {
    DspTimelineParams,
    RankingParams,
    ReleaseOverviewParams,
    RevenueDspBarChartParams,
    RevenueLineChartParams,
    RevenueQueryParams,
    TerTimelineParams,
    TrendViewDspBarChartParams,
    TrendViewLineChartParams,
    TrendViewSummaryParams,
    TrendViewTerBarChartParams,
    RevenueTerBarChartParams,
} from '../types';

export const analytics2QueryKeys = {
    all: ['analytics2'] as const,
    dspTimeline: (params: DspTimelineParams) =>
        [...analytics2QueryKeys.all, 'dsp-timeline', params] as const,
    terTimeline: (params: TerTimelineParams) =>
        [...analytics2QueryKeys.all, 'ter-timeline', params] as const,
    trendViewSummary: (params: TrendViewSummaryParams) =>
        [...analytics2QueryKeys.all, 'trend-view-summary', params] as const,
    trendViewLineChart: (params: TrendViewLineChartParams) =>
        [...analytics2QueryKeys.all, 'trend-view-line-chart', params] as const,
    trendViewDspBarChart: (params: TrendViewDspBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            'trend-view-dsp-bar-chart',
            params,
        ] as const,
    trendViewTerBarChart: (params: TrendViewTerBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            'trend-view-ter-bar-chart',
            params,
        ] as const,
    dspSalesTimeline: (params: DspTimelineParams) =>
        [...analytics2QueryKeys.all, 'dsp-sales-timeline', params] as const,
    dspDailyTimeline: (params: DspTimelineParams) =>
        [...analytics2QueryKeys.all, 'dsp-daily-timeline', params] as const,
    trackRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'track-ranking', params] as const,
    releaseRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'release-ranking', params] as const,
    artistRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'artist-ranking', params] as const,
    labelRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'label-ranking', params] as const,
    tenantRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'tenant-ranking', params] as const,
    dspRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'dsp-ranking', params] as const,
    syncJob: (jobId?: string) =>

        [...analytics2QueryKeys.all, 'SYNC_JOB', jobId] as const,
    revenueSummary: (params: { fromDate: string; toDate: string }) =>
        [...analytics2QueryKeys.all, 'revenue-summary', params] as const,
    revenueLineChart: (params: RevenueLineChartParams) =>
        [...analytics2QueryKeys.all, 'revenue-line-chart', params] as const,
    revenueDspBarChart: (params: RevenueDspBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            'revenue-dsp-bar-chart',
            params,
        ] as const,
    revenueTerBarChart: (params: RevenueTerBarChartParams) =>
        [
            ...analytics2QueryKeys.all,
            'revenue-ter-bar-chart',
            params,
        ] as const,
    revenueTimeline: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-timeline', params] as const,
    revenueTopDsp: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-dsp', params] as const,
    revenueTopTenant: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-tenant', params] as const,
    revenueTopArtist: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-artist', params] as const,
    revenueTopTrack: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-track', params] as const,
    revenueTopRelease: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-release', params] as const,
    revenueTopLabel: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-label', params] as const,
    releaseOverview: (releaseId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            'release-overview',
            releaseId,
            params,
        ] as const,
    releaseDspTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'release-dsp-timeline',
            releaseId,
            params,
        ] as const,
    releaseDspSalesTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'release-dsp-sales-timeline',
            releaseId,
            params,
        ] as const,
    releaseDspDailyTimeline: (releaseId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'release-dsp-daily-timeline',
            releaseId,
            params,
        ] as const,
    releaseRevenueTimeline: (releaseId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            'release-revenue-timeline',
            releaseId,
            params,
        ] as const,
    trackOverview: (isrc: string, params: ReleaseOverviewParams) =>
        [...analytics2QueryKeys.all, 'track-overview', isrc, params] as const,
    trackDspTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'track-dsp-timeline',
            isrc,
            params,
        ] as const,
    trackDspSalesTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'track-dsp-sales-timeline',
            isrc,
            params,
        ] as const,
    trackDspDailyTimeline: (isrc: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'track-dsp-daily-timeline',
            isrc,
            params,
        ] as const,
    trackRevenueTimeline: (isrc: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            'track-revenue-timeline',
            isrc,
            params,
        ] as const,
    labelOverview: (labelId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            'label-overview',
            labelId,
            params,
        ] as const,
    labelDspTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'label-dsp-timeline',
            labelId,
            params,
        ] as const,
    labelDspSalesTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'label-dsp-sales-timeline',
            labelId,
            params,
        ] as const,
    labelDspDailyTimeline: (labelId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'label-dsp-daily-timeline',
            labelId,
            params,
        ] as const,
    labelRevenueTimeline: (labelId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            'label-revenue-timeline',
            labelId,
            params,
        ] as const,
    artistOverview: (artistId: string, params: ReleaseOverviewParams) =>
        [
            ...analytics2QueryKeys.all,
            'artist-overview',
            artistId,
            params,
        ] as const,
    artistDspTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'artist-dsp-timeline',
            artistId,
            params,
        ] as const,
    artistDspSalesTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'artist-dsp-sales-timeline',
            artistId,
            params,
        ] as const,
    artistDspDailyTimeline: (artistId: string, params: DspTimelineParams) =>
        [
            ...analytics2QueryKeys.all,
            'artist-dsp-daily-timeline',
            artistId,
            params,
        ] as const,
    artistRevenueTimeline: (artistId: string, params: RevenueQueryParams) =>
        [
            ...analytics2QueryKeys.all,
            'artist-revenue-timeline',
            artistId,
            params,
        ] as const,
};
