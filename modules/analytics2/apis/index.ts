import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    AnalyticsCommonParams,
    ArtistDspItem,
    ArtistRankingItem,
    ArtistTerItem,
    ChannelDspItem,
    ChannelRankingItem,
    ChannelTerItem,
    DspDetailParams,
    DspRankingItem,
    DspSalesTimelineData,
    DspTimelineData,
    DspTimelineParams,
    ExportReportRequest,
    ExportReportResponse,
    LabelDspItem,
    LabelRankingItem,
    LabelTerItem,
    RankingParams,
    ReleaseDspItem,
    ReleaseOverviewData,
    ReleaseOverviewParams,
    ReleaseRankingItem,
    ReleaseTerItem,
    RevenueArtistItem,
    RevenueChannelItem,
    RevenueDspBarChartItem,
    RevenueDspBarChartParams,
    RevenueDspItem,
    RevenueLabelItem,
    RevenueLineChartItem,
    RevenueLineChartParams,
    RevenueQueryParams,
    RevenueReleaseItem,
    RevenueSourceTypeItem,
    RevenueSummaryData,
    RevenueTenantBarChartItem,
    RevenueTenantItem,
    RevenueTerBarChartItem,
    RevenueTerBarChartParams,
    RevenueTimelineData,
    RevenueTrackItem,
    SyncAllRequest,
    SyncAllResponse,
    SyncJobResponse,
    SyncRequest,
    TenantDspItem,
    TenantRankingItem,
    TenantTerItem,
    TerTimelineData,
    TerTimelineParams,
    TrackDspItem,
    TrackRankingItem,
    TrackTerItem,
    SourceTypeRankingItem,
    TrendViewDspBarChartItem,
    TrendViewDspBarChartParams,
    TrendViewLineChartItem,
    TrendViewLineChartParams,
    TrendViewSummaryData,
    TrendViewSummaryParams,
    TrendViewTenantBarChartItem,
    TrendViewTerBarChartItem,
    TrendViewTerBarChartParams,
} from '../types';

export const analytics2Apis = {
    getDspTimeline: (params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            '/analytics/trend-view/dsp/timeline',
            params
        );
    },
    getDspSalesTimeline: (params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            '/analytics/sales-view/dsp/timeline',
            params
        );
    },
    getDspDailyTimeline: (params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            '/analytics/trend-view/dsp/timeline/daily',
            params
        );
    },
    getTerTimeline: (params: TerTimelineParams) => {
        return axiosInstance.post<DetailResponse<TerTimelineData>>(
            '/analytics/trend-view/ter/timeline',
            params
        );
    },
    getTrendViewSummary: (params: TrendViewSummaryParams) => {
        return axiosInstance.post<DetailResponse<TrendViewSummaryData>>(
            '/analytics/trend-view/summary',
            params
        );
    },
    getTrendViewLineChart: (params: TrendViewLineChartParams) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            '/analytics/trend-view/line-chart',
            params
        );
    },
    getTrendViewDspBarChart: (params: TrendViewDspBarChartParams) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            '/analytics/trend-view/dsp/bar-chart',
            params
        );
    },
    getTrendViewTerBarChart: (params: TrendViewTerBarChartParams) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            '/analytics/trend-view/ter/bar-chart',
            params
        );
    },
    getTrackRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            '/analytics/ranking/tracks',
            params
        );
    },
    getReleaseRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            '/analytics/ranking/releases',
            params
        );
    },
    getArtistRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<ArtistRankingItem>>(
            '/analytics/ranking/artists',
            params
        );
    },
    getLabelRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<LabelRankingItem>>(
            '/analytics/ranking/labels',
            params
        );
    },
    getTenantRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<TenantRankingItem>>(
            '/analytics/ranking/tenants',
            params
        );
    },
    getChannelRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<ChannelRankingItem>>(
            '/analytics/ranking/channels',
            params
        );
    },
    getDspRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<DspRankingItem>>(
            '/analytics/ranking/dsp',
            params
        );
    },
    getSourceTypeRanking: (params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<SourceTypeRankingItem>>(
            '/analytics/ranking/source-types',
            params
        );
    },

    startSync: ({ period, force }: SyncRequest) => {
        return axiosInstance.post<SyncAllResponse>('/etl/ftp/sync', {
            period,
            force,
        });
    },
    startSyncAll: ({ startPeriod, force }: SyncAllRequest) => {
        return axiosInstance.post<SyncAllResponse>('/etl/ftp/sync-all', {
            force,
            startPeriod,
        });
    },
    getSyncJob: (jobId: string) => {
        return axiosInstance.get<SyncJobResponse>(`/etl/jobs/${jobId}`);
    },
    getRevenueSummary: (params: { fromDate: string; toDate: string }) => {
        return axiosInstance.post<DetailResponse<RevenueSummaryData>>(
            '/analytics/revenue/summary',
            params
        );
    },
    getRevenueLineChart: (params: RevenueLineChartParams) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            '/analytics/revenue/line-chart',
            params
        );
    },
    getRevenueDspBarChart: (params: RevenueDspBarChartParams) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            '/analytics/revenue/dsp/bar-chart',
            params
        );
    },
    getRevenueTerBarChart: (params: RevenueTerBarChartParams) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            '/analytics/revenue/ter/bar-chart',
            params
        );
    },
    getRevenueTimeline: (params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            '/analytics/revenue/timeline',
            params
        );
    },
    getRevenueTopDsp: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueDspItem>>(
            '/analytics/revenue/top-dsp',
            params
        );
    },
    getRevenueTopTenant: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueTenantItem>>(
            '/analytics/revenue/top-tenant',
            params
        );
    },
    getRevenueTopArtist: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueArtistItem>>(
            '/analytics/revenue/top-artist',
            params
        );
    },
    getRevenueTopTrack: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueTrackItem>>(
            '/analytics/revenue/top-track',
            params
        );
    },
    getRevenueTopRelease: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueReleaseItem>>(
            '/analytics/revenue/top-release',
            params
        );
    },
    getRevenueTopLabel: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueLabelItem>>(
            '/analytics/revenue/top-label',
            params
        );
    },
    getRevenueTopChannel: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueChannelItem>>(
            '/analytics/revenue/top-channel',
            params
        );
    },
    getRevenueTopSourceType: (params: RevenueQueryParams) => {
        return axiosInstance.post<PaginationResponse<RevenueSourceTypeItem>>(
            '/analytics/revenue/top-source-type',
            params
        );
    },
    getReleaseOverview: (releaseId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/release/${releaseId}/overview`,
            params
        );
    },
    getReleaseDspTimeline: (releaseId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/release/${releaseId}/trend-view/dsp/timeline`,
            params
        );
    },
    getReleaseDspSalesTimeline: (
        releaseId: string,
        params: DspTimelineParams
    ) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/release/${releaseId}/sales-view/dsp/timeline`,
            params
        );
    },
    getReleaseDspDailyTimeline: (
        releaseId: string,
        params: DspTimelineParams
    ) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/release/${releaseId}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getReleaseDsp: (releaseId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseDspItem>>(
            `/analytics/release/${releaseId}/dsp`,
            params
        );
    },
    getReleaseTer: (releaseId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseTerItem>>(
            `/analytics/release/${releaseId}/ter`,
            params
        );
    },
    getReleaseRevenueTimeline: (
        releaseId: string,
        params: RevenueQueryParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/release/${releaseId}/revenue/timeline`,
            params
        );
    },
    getReleaseTrendViewLineChart: (
        releaseId: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/release/${releaseId}/trend-view/line-chart`,
            params
        );
    },
    getReleaseTrendViewDspBarChart: (
        releaseId: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/release/${releaseId}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getReleaseTrendViewTerBarChart: (
        releaseId: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/release/${releaseId}/trend-view/ter/bar-chart`,
            params
        );
    },
    getReleaseRevenueLineChart: (
        releaseId: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/release/${releaseId}/revenue/line-chart`,
            params
        );
    },
    getReleaseRevenueDspBarChart: (
        releaseId: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/release/${releaseId}/revenue/dsp/bar-chart`,
            params
        );
    },
    getReleaseRevenueTerBarChart: (
        releaseId: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/release/${releaseId}/revenue/ter/bar-chart`,
            params
        );
    },
    getTrackOverview: (isrc: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/track/${isrc}/overview`,
            params
        );
    },
    getTrackTrendViewLineChart: (
        isrc: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/track/${isrc}/trend-view/line-chart`,
            params
        );
    },
    getTrackTrendViewDspBarChart: (
        isrc: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/track/${isrc}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getTrackTrendViewTerBarChart: (
        isrc: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/track/${isrc}/trend-view/ter/bar-chart`,
            params
        );
    },
    getTrackDspTimeline: (isrc: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/track/${isrc}/trend-view/dsp/timeline`,
            params
        );
    },
    getTrackDspSalesTimeline: (isrc: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/track/${isrc}/sales-view/dsp/timeline`,
            params
        );
    },
    getTrackDspDailyTimeline: (isrc: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/track/${isrc}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getTrackRevenueTimeline: (isrc: string, params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/track/${isrc}/revenue/timeline`,
            params
        );
    },
    getTrackRevenueLineChart: (
        isrc: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/track/${isrc}/revenue/line-chart`,
            params
        );
    },
    getTrackRevenueDspBarChart: (
        isrc: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/track/${isrc}/revenue/dsp/bar-chart`,
            params
        );
    },
    getTrackRevenueTerBarChart: (
        isrc: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/track/${isrc}/revenue/ter/bar-chart`,
            params
        );
    },
    getTrackDsp: (isrc: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackDspItem>>(
            `/analytics/track/${isrc}/dsp`,
            params
        );
    },
    getTrackTer: (isrc: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackTerItem>>(
            `/analytics/track/${isrc}/ter`,
            params
        );
    },
    getLabelOverview: (labelId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/label/${labelId}/overview`,
            params
        );
    },
    getLabelDspTimeline: (labelId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/label/${labelId}/trend-view/dsp/timeline`,
            params
        );
    },
    getLabelDspSalesTimeline: (labelId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/label/${labelId}/sales-view/dsp/timeline`,
            params
        );
    },
    getLabelDspDailyTimeline: (labelId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/label/${labelId}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getLabelRevenueTimeline: (labelId: string, params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/label/${labelId}/revenue/timeline`,
            params
        );
    },
    getLabelTrendViewLineChart: (
        labelId: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/label/${labelId}/trend-view/line-chart`,
            params
        );
    },
    getLabelTrendViewDspBarChart: (
        labelId: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/label/${labelId}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getLabelTrendViewTerBarChart: (
        labelId: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/label/${labelId}/trend-view/ter/bar-chart`,
            params
        );
    },
    getLabelRevenueLineChart: (
        labelId: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/label/${labelId}/revenue/line-chart`,
            params
        );
    },
    getLabelRevenueDspBarChart: (
        labelId: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/label/${labelId}/revenue/dsp/bar-chart`,
            params
        );
    },
    getLabelRevenueTerBarChart: (
        labelId: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/label/${labelId}/revenue/ter/bar-chart`,
            params
        );
    },
    getLabelDsp: (labelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<LabelDspItem>>(
            `/analytics/label/${labelId}/dsp`,
            params
        );
    },
    getLabelTer: (labelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<LabelTerItem>>(
            `/analytics/label/${labelId}/ter`,
            params
        );
    },
    getLabelTopReleases: (labelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            `/analytics/label/${labelId}/top-releases`,
            params
        );
    },
    getLabelTopTracks: (labelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            `/analytics/label/${labelId}/top-tracks`,
            params
        );
    },
    getArtistOverview: (artistId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/artist/${artistId}/overview`,
            params
        );
    },
    getArtistTopReleases: (artistId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            `/analytics/artist/${artistId}/top-releases`,
            params
        );
    },
    getArtistTopTracks: (artistId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            `/analytics/artist/${artistId}/top-tracks`,
            params
        );
    },
    getArtistDspTimeline: (artistId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/artist/${artistId}/trend-view/dsp/timeline`,
            params
        );
    },
    getArtistDspSalesTimeline: (
        artistId: string,
        params: DspTimelineParams
    ) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/artist/${artistId}/sales-view/dsp/timeline`,
            params
        );
    },
    getArtistDspDailyTimeline: (
        artistId: string,
        params: DspTimelineParams
    ) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/artist/${artistId}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getArtistRevenueTimeline: (
        artistId: string,
        params: RevenueQueryParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/artist/${artistId}/revenue/timeline`,
            params
        );
    },
    getArtistTrendViewLineChart: (
        artistId: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/artist/${artistId}/trend-view/line-chart`,
            params
        );
    },
    getArtistTrendViewDspBarChart: (
        artistId: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/artist/${artistId}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getArtistTrendViewTerBarChart: (
        artistId: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/artist/${artistId}/trend-view/ter/bar-chart`,
            params
        );
    },
    getArtistRevenueLineChart: (
        artistId: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/artist/${artistId}/revenue/line-chart`,
            params
        );
    },
    getArtistRevenueDspBarChart: (
        artistId: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/artist/${artistId}/revenue/dsp/bar-chart`,
            params
        );
    },
    getArtistRevenueTerBarChart: (
        artistId: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/artist/${artistId}/revenue/ter/bar-chart`,
            params
        );
    },
    getArtistDsp: (artistId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ArtistDspItem>>(
            `/analytics/artist/${artistId}/dsp`,
            params
        );
    },
    getArtistTer: (artistId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ArtistTerItem>>(
            `/analytics/artist/${artistId}/ter`,
            params
        );
    },
    exportReport: (params: ExportReportRequest) => {
        return axiosInstance.post<ExportReportResponse>(
            '/analytics/reports/export',
            params
        );
    },
    cancelExportReport: (jobId: string) => {
        return axiosInstance.post<void>(
            `/analytics/reports/export/${jobId}/cancel`
        );
    },
    cancelExportReportList: (jobIds: string[]) => {
        return axiosInstance.post<void>(
            '/analytics/reports/export/cancel-list',
            { jobIds }
        );
    },
    getTenantOverview: (tenantId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/tenant/${tenantId}/overview`,
            params
        );
    },
    getTenantTopReleases: (tenantId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            `/analytics/tenant/${tenantId}/top-releases`,
            params
        );
    },
    getTenantTopTracks: (tenantId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            `/analytics/tenant/${tenantId}/top-tracks`,
            params
        );
    },
    getTenantTrendViewLineChart: (
        tenantId: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/tenant/${tenantId}/trend-view/line-chart`,
            params
        );
    },
    getTenantTrendViewDspBarChart: (
        tenantId: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/tenant/${tenantId}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getTenantTrendViewTerBarChart: (
        tenantId: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/tenant/${tenantId}/trend-view/ter/bar-chart`,
            params
        );
    },
    getTenantRevenueLineChart: (
        tenantId: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/tenant/${tenantId}/revenue/line-chart`,
            params
        );
    },
    getTenantRevenueDspBarChart: (
        tenantId: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/tenant/${tenantId}/revenue/dsp/bar-chart`,
            params
        );
    },
    getTenantRevenueTerBarChart: (
        tenantId: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/tenant/${tenantId}/revenue/ter/bar-chart`,
            params
        );
    },
    getTenantDsp: (tenantId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TenantDspItem>>(
            `/analytics/tenant/${tenantId}/dsp`,
            params
        );
    },
    getTenantTer: (tenantId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TenantTerItem>>(
            `/analytics/tenant/${tenantId}/ter`,
            params
        );
    },
    getChannelOverview: (channelId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/channel/${channelId}/overview`,
            params
        );
    },
    getChannelTopReleases: (
        channelId: string,
        params: AnalyticsCommonParams
    ) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            `/analytics/channel/${channelId}/top-releases`,
            params
        );
    },
    getChannelTrendViewLineChart: (
        channelId: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/channel/${channelId}/trend-view/line-chart`,
            params
        );
    },
    getChannelTrendViewDspBarChart: (
        channelId: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/channel/${channelId}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getChannelTrendViewTerBarChart: (
        channelId: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/channel/${channelId}/trend-view/ter/bar-chart`,
            params
        );
    },
    getChannelRevenueLineChart: (
        channelId: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/channel/${channelId}/revenue/line-chart`,
            params
        );
    },
    getChannelRevenueDspBarChart: (
        channelId: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/channel/${channelId}/revenue/dsp/bar-chart`,
            params
        );
    },
    getChannelRevenueTerBarChart: (
        channelId: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/channel/${channelId}/revenue/ter/bar-chart`,
            params
        );
    },
    getChannelDsp: (channelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ChannelDspItem>>(
            `/analytics/channel/${channelId}/dsp`,
            params
        );
    },
    getChannelTer: (channelId: string, params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ChannelTerItem>>(
            `/analytics/channel/${channelId}/ter`,
            params
        );
    },
    getDspOverview: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            '/analytics/dsp/overview',
            params
        );
    },
    getDspTrendViewLineChart: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            '/analytics/dsp/trend-view/line-chart',
            params
        );
    },
    getDspRevenueLineChart: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            '/analytics/dsp/revenue/line-chart',
            params
        );
    },
    getDspTrendViewTerBarChart: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            '/analytics/dsp/trend-view/ter/bar-chart',
            params
        );
    },
    getDspRevenueTerBarChart: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            '/analytics/dsp/revenue/ter/bar-chart',
            params
        );
    },
    getDspTrendViewTenantBarChart: (params: DspDetailParams) => {
        return axiosInstance.post<
            DetailResponse<TrendViewTenantBarChartItem[]>
        >('/analytics/dsp/trend-view/tenant/bar-chart', params);
    },
    getDspRevenueTenantBarChart: (params: DspDetailParams) => {
        return axiosInstance.post<DetailResponse<RevenueTenantBarChartItem[]>>(
            '/analytics/dsp/revenue/tenant/bar-chart',
            params
        );
    },
    getDspTopReleases: (params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            '/analytics/dsp/top-releases',
            params
        );
    },
    getDspTopTracks: (params: AnalyticsCommonParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            '/analytics/dsp/top-tracks',
            params
        );
    },
    getSourceTypeOverview: (
        sourceType: string,
        params: ReleaseOverviewParams
    ) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/source-type/${sourceType}/overview`,
            params
        );
    },
    getSourceTypeTopReleases: (sourceType: string, params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<ReleaseRankingItem>>(
            `/analytics/source-type/${sourceType}/top-releases`,
            params
        );
    },
    getSourceTypeTopTracks: (sourceType: string, params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<TrackRankingItem>>(
            `/analytics/source-type/${sourceType}/top-tracks`,
            params
        );
    },
    getSourceTypeRevenueLineChart: (
        sourceType: string,
        params: RevenueLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueLineChartItem[]>>(
            `/analytics/source-type/${sourceType}/revenue/line-chart`,
            params
        );
    },
    getSourceTypeTrendViewLineChart: (
        sourceType: string,
        params: TrendViewLineChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewLineChartItem[]>>(
            `/analytics/source-type/${sourceType}/trend-view/line-chart`,
            params
        );
    },
    getSourceTypeRevenueDspBarChart: (
        sourceType: string,
        params: RevenueDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueDspBarChartItem[]>>(
            `/analytics/source-type/${sourceType}/revenue/dsp/bar-chart`,
            params
        );
    },
    getSourceTypeRevenueTerBarChart: (
        sourceType: string,
        params: RevenueTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTerBarChartItem[]>>(
            `/analytics/source-type/${sourceType}/revenue/ter/bar-chart`,
            params
        );
    },
    getSourceTypeTrendViewDspBarChart: (
        sourceType: string,
        params: TrendViewDspBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewDspBarChartItem[]>>(
            `/analytics/source-type/${sourceType}/trend-view/dsp/bar-chart`,
            params
        );
    },
    getSourceTypeTrendViewTerBarChart: (
        sourceType: string,
        params: TrendViewTerBarChartParams
    ) => {
        return axiosInstance.post<DetailResponse<TrendViewTerBarChartItem[]>>(
            `/analytics/source-type/${sourceType}/trend-view/ter/bar-chart`,
            params
        );
    },
};

export const getExportReportEventsUrl = (jobId: string) => {
    return `/api/v1/analytics/reports/export/${jobId}/events`;
};
