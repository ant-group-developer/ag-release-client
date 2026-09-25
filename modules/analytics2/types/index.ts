import { ChannelsData } from '@/modules/channels/types';
import {
    MetadataExternal,
    ReleasesData,
    VideoData,
} from '@/modules/releases/types';
import { TENANT_TYPE } from '@/modules/tenant/enums';
import { TenantData } from '@/modules/tenant/types/data';
import { CommonParams } from '@/types/api';
import {
    ANALYTICS_ENTITY_TYPE,
    ANALYTICS_GRANULARITY,
    ANALYTICS_RELEASE_TYPE,
} from '../enums';
import { ANALYTICS2_TABS } from '../enums/tabs';

export interface Analytics2DataFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    tab?: ANALYTICS2_TABS;
    sortBy?: string;
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

export interface AnalyticsSummaryData {
    totalTrendViews: number;
    totalUsage: number;
    totalRevenueUsd: number;
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

export interface AnalyticsSelectionParams {
    trackIds?: string[];
    releaseIds?: string[];
    tenantIds?: string[];
    labelIds?: string[];
    dspIds?: string[];
    artistIds?: string[];
    channelIds?: string[];
    importSources?: string[];
}

export interface RankingParams extends AnalyticsSelectionParams {
    fromDate: string;
    toDate: string;
    page?: number;
    pageSize?: number;
    keyword?: string;
    groupBySource?: boolean;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    topN?: number;
    includeOther?: boolean;
    sortBy?: string;
    trackId?: string;
    isrc?: string;
    releaseId?: string;
    tenantId?: string;
    labelId?: string;
    pgDspId?: string;
    dspReportId?: string;
    dspId?: string;
    artistId?: string;
    channelId?: string;
    importSource?: string;
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
    labelId?: string;
    labelName?: string;
    metadataExternal?: MetadataExternal;
    bySource?: BySourceItem[];
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
    bySource?: BySourceItem[];
    workspaces?: TenantData[];
    metadataExternal?: MetadataExternal;
    video?: VideoData;
}

export interface ReleaseVideoRankingItem {
    rank: number;
    releaseId: string;
    title: string;
    upc: string;
    isrc?: string;
    labelId: string;
    labelName: string;
    trackCount: number;
    totalViews: number;
    channels: Pick<ChannelsData, 'id' | 'name' | 'youtubeChannelId'>[];
    workspaces: (Pick<TenantData, 'id' | 'name'> & { logo?: string | null })[];
    release?: Pick<ReleasesData, 'coverArtThumbnails'>;
    video: VideoData;
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
    bySource?: BySourceItem[];
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
    logoUrl?: string | null;
    releaseCount: number;
    trackCount: number;
    totalViews: number;
    tenant?: TenantInfo | null;
    workspaces?: TenantData[];
    bySource?: BySourceItem[];
}

export interface TenantRankingItem {
    rank: number;
    tenantId: string;
    tenantName: string;
    logo: string | null;
    totalViews: number;
    bySource?: BySourceItem[];
    type: TENANT_TYPE;
}

export interface ChannelRankingItem {
    rank: number;
    channelId: string;
    channelName: string;
    youtubeChannelId?: string;
    thumbUrl?: string | null;
    totalViews: number;
    tenant?: TenantInfo | null;
    currentTenant?: TenantInfo | null;
    bySource?: BySourceItem[];
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
export interface RevenueQueryParams
    extends CommonParams,
        AnalyticsSelectionParams {
    fromDate: string;
    toDate: string;
    topN?: number;
    includeOther?: boolean;
    groupBySource?: boolean;
    releaseType?: ANALYTICS_RELEASE_TYPE;
    sortBy?: string;
    trackId?: string;
    isrc?: string;
    releaseId?: string;
    tenantId?: string;
    labelId?: string;
    pgDspId?: string;
    dspReportId?: string;
    dspId?: string;
    artistId?: string;
    channelId?: string;
    importSource?: string;
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
    dspName?: string;
    source?: string;
    sourceLabel?: string;
    revenueUsd: number;
    quantity: number;
    pgDspId?: string;
    dspReportId?: string;
    imageUrl?: string | null;
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
    type: TENANT_TYPE;
}

export interface RevenueChannelItem {
    rank: number;
    channelId: string;
    channelName: string;
    youtubeChannelId?: string;
    thumbUrl?: string | null;
    revenueUsd: number;
    quantity: number;
    tenant?: TenantInfo | null;
    currentTenant?: TenantInfo | null;
    bySource?: BySourceItem[];
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
    bySource?: BySourceItem[];
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
    labelId?: string;
    labelName?: string;
    metadataExternal?: MetadataExternal;
    bySource?: BySourceItem[];
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
    releaseType?: ANALYTICS_RELEASE_TYPE;
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
    workspace?: TenantData;
    workspaces?: TenantData[];
    bySource?: BySourceItem[];
    metadataExternal?: MetadataExternal;
}

export interface RevenueReleaseVideoItem {
    rank: number;
    releaseId: string;
    title: string;
    upc: string;
    isrc?: string;
    labelId: string;
    labelName: string;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
    channels: Pick<ChannelsData, 'id' | 'name' | 'youtubeChannelId'>[];
    workspaces: (Pick<TenantData, 'id' | 'name'> & { logo?: string | null })[];
    release?: Pick<ReleasesData, 'coverArtThumbnails'>;
    video: VideoData;
}

export interface RevenueLabelItem {
    rank: number;
    labelId: string;
    labelName: string;
    picture: string | null;
    image?: string | null;
    logoUrl?: string | null;
    releaseCount?: number;
    trackCount: number;
    revenueUsd: number;
    quantity: number;
    tenant?: TenantInfo | null;
    workspaces?: TenantData[];
    bySource?: BySourceItem[];
}

export interface AnalyticsScopeParams {
    trackId?: string;
    isrc?: string;
    releaseId?: string;
    tenantId?: string;
    labelId?: string;
    pgDspId?: string;
    dspReportId?: string;
    dspId?: string;
    artistId?: string;
    channelId?: string;
    importSource?: string;
}

export interface TrendViewLineChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface TrendViewLineChartItem {
    period: string;
    totalViews: number;
}

export interface TrendViewLineChartV2DspId {
    pgDspId: string;
    dspReportId: string;
}

export interface TrendViewLineChartV2Filters {
    tenantIds?: string[];
    labelIds?: string[];
    artistIds?: string[];
    releaseIds?: string[];
    channelIds?: string[];
    isrcs?: string[];
    importSources?: string[];
    dspIds?: TrendViewLineChartV2DspId[];
}

export interface TrendViewLineChartV2Params {
    fromDate: string;
    toDate: string;
    releaseType?: ANALYTICS_RELEASE_TYPE | string;
    seriesBy: string;
    filters: TrendViewLineChartV2Filters;
    granularity: ANALYTICS_GRANULARITY | 'day' | 'month' | string;
}

export interface TrendViewLineChartV2SeriesValue {
    period: string;
    totalViews?: number;
    revenueUsd?: number;
    revenueUsdExact?: string;
    quantity?: number;
}

export interface TrendViewLineChartV2SeriesMetadata {
    id: string;
    type: string;
    name: string;
    imageUrl?: string;
    pgDspId?: string;
    dspReportId?: string;
}

export interface TrendViewLineChartV2Series {
    id: string;
    metadata: TrendViewLineChartV2SeriesMetadata;
    values: TrendViewLineChartV2SeriesValue[];
}

export interface TrendViewLineChartV2Data {
    seriesBy: string;
    series: TrendViewLineChartV2Series[];
}

export type RevenueLineChartV2Params = TrendViewLineChartV2Params;
export type RevenueLineChartV2Data = TrendViewLineChartV2Data;

export interface TrendViewDspBarChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface TrendViewDspBarChartItem {
    dspName: string;
    totalViews: number;
    imageUrl?: string;
}

export interface DspRankingItem {
    rank: number;
    dspName?: string;
    source?: string;
    sourceLabel?: string;
    totalViews: number;
    pgDspId?: string;
    dspReportId?: string;
    imageUrl?: string | null;
    bySource?: BySourceItem[];
}

export interface BySourceItem {
    source: string;
    sourceLabel: string;
    quantity: number;
    revenueUsd?: number;
}

export interface RevenueLineChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface RevenueLineChartItem {
    period: string;
    revenueUsd: number;
    quantity: number;
}

export interface RevenueDspBarChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface RevenueDspBarChartItem {
    dspName: string;
    revenueUsd: number;
    quantity: number;
    imageUrl?: string;
}

export interface TrendViewTerBarChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface TrendViewTerBarChartItem {
    territory: string;
    totalViews: number;
}

export interface RevenueTerBarChartParams extends AnalyticsScopeParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: ANALYTICS_RELEASE_TYPE;
}

export interface RevenueTerBarChartItem {
    territory: string;
    revenueUsd: number;
    revenueUsdExact: string;
    quantity?: number;
}

export interface ExportReportRequest {
    fromDate: string;
    endDate: string;
    format?: 'xlsx' | 'csv';
    labelId?: string;
    artistId?: string;
    releaseId?: string;
    dspId?: string;
    pgDspId?: string;
    dspReportId?: string;
    isrc?: string;
    channelId?: string;
    importSource?: string;
    tenantIds?: string[];
    splitMode?: EXPORT_OPTION;
    periodUnit?: PERIOD_TYPE;
    isExportArtist?: boolean;
    releaseType?: 'audio' | 'video';
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
    fromDate?: string;
    toDate?: string;
    releaseType?: string | ANALYTICS_RELEASE_TYPE;
    sortBy?: string;
}

export interface DspRankingParams extends DspDetailParams {
    page?: number;
    pageSize?: number;
    topN?: number;
    isIncludeOther?: boolean;
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

export interface AnalyticsCommonParams extends CommonParams {
    fromDate?: string;
    toDate?: string;
    releaseType?: string | ANALYTICS_RELEASE_TYPE;
    sortBy?: string;
    topN?: number;
    includeOther?: boolean;
    releaseId?: string;
    trackId?: string;
    isrc?: string;
    workspaceId?: string;
    tenantId?: string;
    labelId?: string;
    dspId?: string;
    pgDspId?: string;
    dspReportId?: string;
    artistId?: string;
    channelId?: string;
    importSource?: string;
    trackIds?: string[];
    releaseIds?: string[];
    tenantIds?: string[];
    labelIds?: string[];
    dspIds?: string[];
    artistIds?: string[];
    channelIds?: string[];
    importSources?: string[];
    groupBySource?: boolean;
    territoryCode?: string;
    granularity?: ANALYTICS_GRANULARITY | 'day' | 'month' | string;
}

export interface TrendViewDemographicsBarChartItem {
    label: string;
    dimensionValue: string;
    totalViews: number;
    percent: number;
}

export interface TrendViewDemographicsBarChartData {
    totalViews: number;
    coverage: number | null;
    items: TrendViewDemographicsBarChartItem[];
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

export interface SourceTypeRankingItem {
    rank: number;
    sourceType: string;
    sourceTypeLabel: string;
    totalViews: number;
    imageUrl?: string | null;
}

export interface RevenueSourceTypeItem {
    rank?: number;
    sourceType: string;
    sourceTypeLabel: string;
    revenueUsd: number;
    quantity: number;
    imageUrl?: string | null;
}

export type AnalyticsEntityType =
    | ANALYTICS_ENTITY_TYPE
    | `${ANALYTICS_ENTITY_TYPE}`;

export type AnalyticsSelectedIds = Partial<Record<string, string[]>>;

export interface ActiveAnalyticsEntity {
    type: AnalyticsEntityType;
    id?: string;
    entitySubId?: string;
}

export interface AnalyticsFilterItem {
    type: AnalyticsEntityType;
    id: string;
    entitySubId?: string;
    title: string;
    thumbnailUrl?: string;
}
