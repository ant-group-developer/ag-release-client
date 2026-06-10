import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    DspTimelineData,
    DspSalesTimelineData,
    DspTimelineParams,
    TerTimelineData,
    TerTimelineParams,
    RankingParams,
    TrackRankingItem,
    ReleaseRankingItem,
    ArtistRankingItem,
    LabelRankingItem,
    SyncRequest,
    SyncAllRequest,
    SyncAllResponse,
    SyncJobResponse,
    RevenueQueryParams,
    RevenueSummaryData,
    RevenueTimelineData,
    RevenueDspItem,
    RevenueArtistItem,
    RevenueTrackItem,
    ReleaseOverviewParams,
    ReleaseOverviewData,
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
    getTrackRanking: (params: RankingParams) => {
        return axiosInstance.post<DetailResponse<{ items: TrackRankingItem[] }>>(
            '/analytics/ranking/tracks',
            params
        );
    },
    getReleaseRanking: (params: RankingParams) => {
        return axiosInstance.post<DetailResponse<{ items: ReleaseRankingItem[] }>>(
            '/analytics/ranking/releases',
            params
        );
    },
    getArtistRanking: (params: RankingParams) => {
        return axiosInstance.post<DetailResponse<{ items: ArtistRankingItem[] }>>(
            '/analytics/ranking/artists',
            params
        );
    },
    getLabelRanking: (params: RankingParams) => {
        return axiosInstance.post<DetailResponse<{ items: LabelRankingItem[] }>>(
            '/analytics/ranking/labels',
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
        return axiosInstance.post<DetailResponse<RevenueDspItem[]>>(
            '/analytics/revenue/top-dsp',
            params
        );
    },
    getRevenueTopArtist: (params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueArtistItem[]>>(
            '/analytics/revenue/top-artist',
            params
        );
    },
    getRevenueTopTrack: (params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueTrackItem[]>>(
            '/analytics/revenue/top-track',
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
    getReleaseDspSalesTimeline: (releaseId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/release/${releaseId}/sales-view/dsp/timeline`,
            params
        );
    },
    getReleaseDspDailyTimeline: (releaseId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/release/${releaseId}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getReleaseRevenueTimeline: (releaseId: string, params: RevenueQueryParams) => {
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
    getArtistDspSalesTimeline: (artistId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspSalesTimelineData>>(
            `/analytics/artist/${artistId}/sales-view/dsp/timeline`,
            params
        );
    },
    getArtistDspDailyTimeline: (artistId: string, params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            `/analytics/artist/${artistId}/trend-view/dsp/timeline/daily`,
            params
        );
    },
    getArtistRevenueTimeline: (artistId: string, params: RevenueQueryParams) => {
        return axiosInstance.post<DetailResponse<RevenueTimelineData>>(
            `/analytics/artist/${artistId}/revenue/timeline`,
            params
        );
    },
};

