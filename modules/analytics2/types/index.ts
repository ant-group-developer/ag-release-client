import { ReleasesData } from '@/modules/releases/types';
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

export interface TrendViewSummaryParams {
    fromDate: string;
    toDate: string;
}

export interface TrendViewSummaryData {
    totalViews: number;
}

export interface DspSalesSeriesItem {
    dsp: string;
    salesViews: number;
    revenueUsd: number;
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
    keyword?: string;
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
    release?: ReleasesData;
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
    release?: ReleasesData;
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

export interface TenantRankingItem {
    rank: number;
    tenantId: string;
    tenantName: string;
    logo: string | null;
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

// Params for Revenue APIs
export interface RevenueQueryParams extends CommonParams {
    fromDate: string;
    toDate: string;
    topN?: number;
    includeOther?: boolean;
}

// Summary Response
export interface RevenueSummaryData {
    totalRevenueUsd: number;
    totalQuantity: number;
    totalTerritories: number;
}

// Timeline Series Items
export interface RevenueTimelineDspItem {
    dsp: string;
    revenueUsd: number;
    quantity: number;
}

export interface RevenueTimelinePeriod {
    period: string; // 'YYYY-MM'
    revenueUsd: number;
    quantity: number;
    series: RevenueTimelineDspItem[];
}

export interface RevenueTimelineData {
    topDsps: string[];
    items: RevenueTimelinePeriod[];
}

// Top DSP Response
export interface RevenueDspItem {
    dspName: string;
    revenueUsd: number;
    quantity: number;
}

export interface RevenueTenantItem {
    rank: number;
    tenantId: string;
    tenantName: string;
    logo: string | null;
    revenueUsd: number;
    quantity: number;
}

// Top Artist Response
export interface RevenueArtistItem {
    rank: number;
    artistId: string;
    artistName: string;
    picture: string | null;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
}

// Top Track Response
export interface RevenueTrackItem {
    rank: number;
    isrc: string;
    title: string;
    version: string | null;
    artistName: string;
    releaseId: string | null;
    releaseTitle: string | null;
    revenueUsd: number;
    quantity: number;
    release?: ReleasesData;
}

export interface TerTimelineParams {
    fromDate: string;
    toDate: string;
    topN?: number;
    includeOther?: boolean;
}

export interface TerSeriesItem {
    territory: string;
    trendViews: number;
}

export interface TerTimelinePeriod {
    period: string;
    series: TerSeriesItem[];
}

export interface TerTimelineData {
    topTerritories: string[];
    items: TerTimelinePeriod[];
}

export interface ReleaseOverviewParams {
    fromDate: string;
    toDate: string;
}

export interface ReleaseOverviewData {
    totalTrendViews: number;
    totalSalesViews: number;
    totalRevenueUsd: number;
}

export interface RevenueReleaseItem {
    rank: number;
    releaseId: string;
    title: string;
    upc: string;
    labelId: string;
    labelName: string;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
    release?: ReleasesData;
}

export interface RevenueLabelItem {
    rank: number;
    labelId: string;
    labelName: string;
    picture: string | null;
    releaseCount?: number;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
}


export interface TrendViewLineChartParams {
    fromDate: string;
    toDate: string;
}

export interface TrendViewLineChartItem {
    period: string;
    totalViews: number;
}

export interface TrendViewDspBarChartParams {
    fromDate: string;
    toDate: string;
}

export interface TrendViewDspBarChartItem {
    dspName: string;
    totalViews: number;
}

export interface DspRankingItem {
    rank: number;
    dspName: string;
    totalViews: number;
}

export interface RevenueLineChartParams {
    fromDate: string;
    toDate: string;
}

export interface RevenueLineChartItem {
    period: string;
    revenueUsd: number;
    quantity: number;
}

export interface RevenueDspBarChartParams {
    fromDate: string;
    toDate: string;
}

export interface RevenueDspBarChartItem {
    dspName: string;
    revenueUsd: number;
    quantity: number;
}



