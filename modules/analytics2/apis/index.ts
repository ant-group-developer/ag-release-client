import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    ArtistRankingItem,
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
    TrendViewSummaryData,
    TrendViewSummaryParams,
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
};
