import { DspTimelineParams, RankingParams } from '../types';

export const analytics2QueryKeys = {
    all: ['analytics2'] as const,
    dspTimeline: (params: DspTimelineParams) =>
        [...analytics2QueryKeys.all, 'dsp-timeline', params] as const,
    trackRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'track-ranking', params] as const,
    releaseRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'release-ranking', params] as const,
    artistRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'artist-ranking', params] as const,
    labelRanking: (params: RankingParams) =>
        [...analytics2QueryKeys.all, 'label-ranking', params] as const,
    syncJob: (jobId?: string) =>
        [...analytics2QueryKeys.all, 'SYNC_JOB', jobId] as const,
};
