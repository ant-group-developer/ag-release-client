import { DspTimelineParams, RankingParams, RevenueQueryParams } from '../types';

export const analytics2QueryKeys = {
    all: ['analytics2'] as const,
    dspTimeline: (params: DspTimelineParams) =>
        [...analytics2QueryKeys.all, 'dsp-timeline', params] as const,
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
    syncJob: (jobId?: string) =>
        [...analytics2QueryKeys.all, 'SYNC_JOB', jobId] as const,
    revenueSummary: (params: { fromDate: string; toDate: string }) =>
        [...analytics2QueryKeys.all, 'revenue-summary', params] as const,
    revenueTimeline: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-timeline', params] as const,
    revenueTopDsp: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-dsp', params] as const,
    revenueTopArtist: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-artist', params] as const,
    revenueTopTrack: (params: RevenueQueryParams) =>
        [...analytics2QueryKeys.all, 'revenue-top-track', params] as const,
};

