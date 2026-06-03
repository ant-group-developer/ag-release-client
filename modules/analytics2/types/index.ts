import { CommonParams } from '@/types/api';

export interface Analytics2DataFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
}

export interface DspTimelineParams {
    fromDate: string;
    toDate: string;
    topN?: number;
    includeOther?: boolean;
}

export interface DspSeriesItem {
    dsp: string;
    trendViews: number;
}

export interface DspTimelinePeriod {
    period: string;
    series: DspSeriesItem[];
}

export interface DspTimelineData {
    topDsps: string[];
    items: DspTimelinePeriod[];
}

export interface DspSalesSeriesItem {
    dsp: string;
    salesViews: number;
}

export interface DspSalesTimelinePeriod {
    period: string;
    series: DspSalesSeriesItem[];
}

export interface DspSalesTimelineData {
    topDsps: string[];
    items: DspSalesTimelinePeriod[];
}

export interface RankingParams {
    fromDate: string;
    toDate: string;
    page: number;
    pageSize: number;
}

export interface TrackRankingItem {
    rank: number;
    isrc: string;
    title: string;
    version: string;
    artistName: string;
    releaseId: string;
    releaseTitle: string;
    totalViews: number;
}

export interface ReleaseRankingItem {
    rank: number;
    releaseId: string;
    title: string;
    upc: string;
    labelId: string;
    labelName: string;
    trackCount: number;
    totalViews: number;
}

export interface ArtistRankingItem {
    rank: number;
    artistId: string;
    artistName: string;
    picture: string | null;
    trackCount: number;
    totalViews: number;
}

export interface LabelRankingItem {
    rank: number;
    labelId: string;
    labelName: string;
    picture: string | null;
    releaseCount: number;
    trackCount: number;
    totalViews: number;
}

export interface SyncRequest {
    period: string;
    force: boolean;
}

export interface SyncAllRequest {
    startPeriod: string;
    force: boolean;
}

export interface SyncAllResponse {
    jobId: string;
    message: string;
}

export interface SyncJobProgress {
    current: number;
    total: number;
    currentItem?: string;
}

export interface SyncJobResponse {
    id: string;
    type: string;
    status: string;
    progress?: SyncJobProgress;
    params: {
        force: boolean;
        startPeriod: string;
    };
    createdAt: string;
    startedAt?: string;
    durationMs?: number;
}