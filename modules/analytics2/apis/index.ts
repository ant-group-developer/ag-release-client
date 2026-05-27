import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    DspTimelineData,
    DspTimelineParams,
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
