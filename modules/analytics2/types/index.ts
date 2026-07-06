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
    groupBySource?: boolean;
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
    profiles?: {
        dspCode: string;
        dspName: string;
        url: string;
    }[];
    country?: string | null;
    genre?: string | null;
}

export interface TenantInfo {
    id: string;
    name: string;
    title?: string | null;
    logo?: string | null;
}

export interface LabelRankingItem {
    rank: number;
    labelId: string;
    labelName: string;
    picture: string | null;
    image?: string | null;
    releaseCount: number;
    trackCount: number;
    totalViews: number;
    tenant?: TenantInfo | null;
}

export interface TenantRankingItem {
    rank: number;
    tenantId: string;
    tenantName: string;
    logo: string | null;
    totalViews: number;
    bySource?: BySourceItem[];
}

export interface ChannelRankingItem {
    rank: number;
    channelId: string;
    channelName: string;
    thumbUrl?: string | null;
    totalViews: number;
    tenant?: TenantInfo | null;
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
    groupBySource?: boolean;
}

// Summary Response
export interface RevenueSummaryData {
    totalRevenueUsd: number;
    totalQuantity: number;
    totalTerritories: number;
}

// Table/Timeline Series Items
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
    pgDspId: string;
    dspReportId: string;
    bySource?: BySourceItem[];
}

export interface RevenueTenantItem {
    rank: number;
    tenantId: string;
    tenantName: string;
    logo: string | null;
    revenueUsd: number;
    quantity: number;
    bySource?: BySourceItem[];
}

export interface RevenueChannelItem {
    rank: number;
    channelId: string;
    channelName: string;
    thumbUrl?: string | null;
    revenueUsd: number;
    quantity: number;
    tenant?: TenantInfo | null;
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
    profiles?: {
        dspCode: string;
        dspName: string;
        url: string;
    }[];
    country?: string | null;
    genre?: string | null;
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
    image?: string | null;
    releaseCount?: number;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
    tenant?: TenantInfo | null;
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
    pgDspId: string;
    dspReportId: string;
    bySource?: BySourceItem[];
}

export interface BySourceItem {
    source: string;
    sourceLabel: string;
    quantity: number;
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

export interface TrendViewTerBarChartParams {
    fromDate: string;
    toDate: string;
}

export interface TrendViewTerBarChartItem {
    territory: string;
    totalViews: number;
}

export interface RevenueTerBarChartParams {
    fromDate: string;
    toDate: string;
}

export interface RevenueTerBarChartItem {
    territory: string;
    revenueUsd: number;
    revenueUsdExact: string;
}

export interface ExportReportRequest {
    fromDate: string;
    endDate: string;
    tenantIds: string[];
    splitMode: EXPORT_OPTION;
    periodUnit?: PERIOD_TYPE;
    isExportArtist?: boolean;
}

export interface ExportReportResponse {
    jobId: string;
    status: string;
    eventsUrl: string;
}

export interface ExportReportJob {
    id: string;
    createdAt: number;
}

export enum ExportReportEventType {
    PROGRESS = 'progress',
    HEARTBEAT = 'heartbeat',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export enum EXPORT_OPTION {
    BY_WORKSPACE = 'by_workspace',
    BY_ARTIST = 'by_artist',
    BY_PERIOD = 'by_period',
    WORKSPACE_ARTIST = 'workspace_artist',
    WORKSPACE_PERIOD = 'workspace_period',
}

export enum PERIOD_TYPE {
    MONTH = 'month',
    QUARTER = 'quarter',
    NONE = 'none',
}

export interface ExportReportEventSummary {
    status?: string;
    progress?: {
        current: number;
        total: number;
        label: string;
    };
    rows?: {
        total: number;
        processed: number;
        skipped: number;
        errors: number;
    };
    file?: {
        name: string;
        sizeBytes: number;
        hash: string | null;
    };
    result?: {
        fileName: string;
        key: string;
        downloadUrl: string;
        expiresInSeconds: number;
        totalRows: number;
        totalProcessedRows: number;
    };
    error?: string | null;
}

export interface ExportReportEventData {
    type: ExportReportEventType | string;
    id?: string;
    sourceType?: string;
    status?: string;
    progress?: ExportReportEventSummary['progress'];
    rows?: ExportReportEventSummary['rows'];
    file?: ExportReportEventSummary['file'];
    result?: ExportReportEventSummary['result'];
    error?: string | null;
    summary?: Partial<ExportReportEventSummary>;
    [key: string]: any;
}

export interface DspDetailParams {
    pgDspId: string;
    dspReportId: string;
    fromDate: string;
    toDate: string;
}

export interface DspRankingParams extends DspDetailParams {
    page?: number;
    pageSize?: number;
}

export interface TrendViewTenantBarChartItem {
    tenantName: string;
    totalViews: number;
}

export interface RevenueTenantBarChartItem {
    tenantName: string;
    revenueUsd: number;
    quantity: number;
}

export interface AnalyticsCommonParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: string;
    sortBy?: string;
    page?: number;
    pageSize?: number;
    includeOther?: boolean;
}

export type ReleaseDspParams = AnalyticsCommonParams;

export interface ReleaseDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type ReleaseTerParams = AnalyticsCommonParams;

export interface ReleaseTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type TrackDspParams = AnalyticsCommonParams;

export interface TrackDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type TrackTerParams = AnalyticsCommonParams;

export interface TrackTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type ArtistDspParams = AnalyticsCommonParams;

export interface ArtistDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type ArtistTerParams = AnalyticsCommonParams;

export interface ArtistTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type LabelDspParams = AnalyticsCommonParams;

export interface LabelDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type LabelTerParams = AnalyticsCommonParams;

export interface LabelTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type TenantDspParams = AnalyticsCommonParams;

export interface TenantDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type TenantTerParams = AnalyticsCommonParams;

export interface TenantTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type ChannelDspParams = AnalyticsCommonParams;

export interface ChannelDspItem {
    rank: number;
    dspId: string;
    dspName: string;
    totalViews: number;
    totalRevenueUsd: string;
}

export type ChannelTerParams = AnalyticsCommonParams;

export interface ChannelTerItem {
    rank: number;
    territory: string;
    totalViews: number;
    totalRevenueUsd: string;
}




