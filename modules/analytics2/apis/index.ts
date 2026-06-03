import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    DspTimelineData,
    DspSalesTimelineData,
    DspTimelineParams,
    RankingParams,
    TrackRankingItem,
    ReleaseRankingItem,
    ArtistRankingItem,
    LabelRankingItem,
    SyncRequest,
    SyncAllRequest,
    SyncAllResponse,
    SyncJobResponse,
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
};
