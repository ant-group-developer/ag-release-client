import { TrackData } from '@/modules/tracks/types';
import { UserDetail } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import { TRACK_SCAN_STATUS } from '../enums';

export interface TrackScanHistoryData extends CommonAttribute {
    trackId: string;
    result: ResultScan[];
}

export interface ResultScan {
    key: {
        startSecond: number;
        endSecond: number;
    };
    content: AcrMetadata | null;
}

export interface AcrMetadata {
    music?: AcrMusicItem[];
    humming?: AcrHummingItem[];
}

interface AcrArtist {
    name: string;
    langs?: { name: string; code: string }[];
    roles?: string[];
}

interface AcrAlbum {
    name: string;
    id?: string;
}

interface AcrGenre {
    id?: number;
    name: string;
}

interface AcrExternalMetadata {
    spotify?: {
        track?: { id: string; name: string };
        album?: { id: string; name: string };
        artists?: { id: string; name: string }[];
    };
    deezer?: {
        track?: { id: string; name: string };
        album?: { id: string; name: string };
        artists?: {
            id?: string;
            name: string;
            langs?: { name: string; code: string }[];
        }[];
    };
    youtube?: {
        vid: string;
    };
    [key: string]: any;
}

interface AcrExternalIds {
    isrc?: string;
    upc?: string;
    [key: string]: string | undefined;
}

export interface AcrMusicItem {
    release_date?: string;
    duration_ms?: number | string;
    artists: AcrArtist[];
    db_begin_time_offset_ms?: number;
    db_end_time_offset_ms?: number;
    sample_begin_time_offset_ms?: number;
    sample_end_time_offset_ms?: number;
    play_offset_ms: number;
    result_from: number;
    acrid: string;
    title: string;
    album?: AcrAlbum;
    label?: string;
    score: number;
    external_metadata?: AcrExternalMetadata;
    external_ids?: AcrExternalIds;
    genres?: AcrGenre[];
    language?: string;
}

export interface AcrHummingItem {
    release_date?: string;
    duration_ms?: number | string;
    artists: AcrArtist[];
    label?: string;
    play_offset_ms: number;
    result_from: number;
    acrid: string;
    title: string;
    album?: AcrAlbum;
    external_metadata?: AcrExternalMetadata;
    external_ids?: AcrExternalIds;
    score: number;
    language?: string;
    langs?: { name: string; code: string }[];
}

export interface TrackScanStatusFilter {
    trackCreatedAtStart: string;
    trackCreatedAtEnd: string;
    TrackIds: string[];
    ignoreTrackScanned: boolean;
}

export interface TrackScanStatusData extends CommonAttribute {
    creatorId: string;
    creator: Pick<UserDetail, 'avatar' | 'name'>;
    modifierId: string;
    status: TRACK_SCAN_STATUS;
    filter: TrackScanStatusFilter;
    trackNeedScanIds: string[];
    trackScannedIds: string[];
    trackNeedScan: Pick<TrackData, 'id' | 'title'>[];
    trackScanned: Pick<TrackData, 'id' | 'title'>[];
}

export interface TrackScanStatusDataFilter extends CommonParams {
    createdAt?: string;
}
