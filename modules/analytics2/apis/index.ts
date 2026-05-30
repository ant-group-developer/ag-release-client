import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    DspTimelineData,
    DspTimelineParams,
    TrendTimelineData,
    TrendTimelineParams,
    RankingParams,
    TrackRankingItem,
    ReleaseRankingItem,
    ArtistRankingItem,
    LabelRankingItem,
} from '../types';

export const analytics2Apis = {
    getDspTimeline: (params: DspTimelineParams) => {
        return axiosInstance.post<DetailResponse<DspTimelineData>>(
            '/analytics/sales-view/dsp/timeline',
            params
        );
    },
    getTrendTimeline: (params: TrendTimelineParams) => {
        return axiosInstance.post<DetailResponse<TrendTimelineData>>(
            '/analytics/trend-view/dsp/timeline',
            params
        );
    },
    getTrendViewDailyTimeline: (params: TrendTimelineParams) => {
        return axiosInstance.post<DetailResponse<TrendTimelineData>>(
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
};
