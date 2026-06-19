import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    ArtistRankingItem,
    DspRankingItem,
    DspSalesTimelineData,
    DspTimelineData,
    DspTimelineParams,
    LabelRankingItem,
    RankingParams,
    ReleaseOverviewData,
    ReleaseOverviewParams,
    ReleaseRankingItem,
    RevenueArtistItem,
    RevenueDspItem,
    RevenueQueryParams,
    RevenueReleaseItem,
    RevenueLabelItem,
    RevenueDspBarChartItem,
    RevenueDspBarChartParams,
    RevenueLineChartItem,
    RevenueLineChartParams,
    RevenueSummaryData,
    RevenueTenantItem,
    RevenueTimelineData,
    RevenueTrackItem,
    SyncAllRequest,
    SyncAllResponse,
    SyncJobResponse,
    SyncRequest,
    TenantRankingItem,
    TerTimelineData,
    TerTimelineParams,
    TrackRankingItem,
    TrendViewDspBarChartItem,
    TrendViewDspBarChartParams,
    TrendViewLineChartItem,
    TrendViewLineChartParams,
    TrendViewSummaryData,
    TrendViewSummaryParams,
    TrendViewTerBarChartItem,
    TrendViewTerBarChartParams,
    RevenueTerBarChartItem,
    RevenueTerBarChartParams,
    ExportReportRequest,
    ExportReportResponse,
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
    getDspRanking: (params: RankingParams) => {
        return axiosInstance.post<PaginationResponse<DspRankingItem>>(
            '/analytics/ranking/dsp',
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
    getReleaseRevenueTimeline: (
        releaseId: string,
        params: RevenueQueryParams
    ) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/release/${releaseId}/revenue/timeline`,
            params
        );
    },
    getTrackOverview: (isrc: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/track/${isrc}/overview`,
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
    getArtistOverview: (artistId: string, params: ReleaseOverviewParams) => {
        return axiosInstance.post<DetailResponse<ReleaseOverviewData>>(
            `/analytics/artist/${artistId}/overview`,
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
};

export const getExportReportEventsUrl = (jobId: string) => {
    return `/api/v1/analytics/reports/export/${jobId}/events`;
};

