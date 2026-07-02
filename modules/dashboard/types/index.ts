import { CommonParams } from '@/types/api';

export interface TopListRowData {
    id?: number;
    image?: string;
    title: string;
    artist?: string;
    plays?: number;
}

export interface AlbumData {
    id: number;
    title: string;
    artist: string;
    date: string;
    tracks: number;
    image: string;
    status: string;
    plays: number;
}

export interface BaseCountData {
    id: string;
    name?: string;
    count?: string;
}

export interface IssueCountData extends BaseCountData {
    nameEn: string;
    total: number;
}

export interface OverviewCountData {
    releasesCount: number;
    releasesImportCount: number;
    tracksCount: number;
    tracksImportCount: number;
    labelsCount: number;
    artistsCount: number;
}

export interface CountryCountData {
    countryCode: string;
    total: number;
}

export interface DashboardDataFilter extends CommonParams {
    startDate?: string;
    endDate?: string;
    isImportedFromReport?: string;
}

export interface AnalyticDashboardParams {
    fromDate: string;
    toDate: string;
    topN?: number;
    includeOther?: boolean;
    type: 'stream' | 'revenue';
}

export interface AnalyticDashboardData {
    name: string;
    value: number;
}
