import { GenresData } from '@/modules/genres/types';
import { LabelData } from '@/modules/labels/types';
import { LanguagesData } from '@/modules/languages/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { TimezoneData } from '@/modules/timezone/types';
import { TrackData } from '@/modules/tracks/types';
import { CommonAttribute, CommonParams } from '@/types/api';
import { RELEASES_STATUS, RELEASES_TYPE } from '../enums';

export interface ReleaseCoverArt {
    '75x75': string | null;
    '100x100': string | null;
    '160x160': string | null;
    '300x300': string | null;
    '900x900': string | null;
    original: string | null;
}

export interface ReleasesData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    upc: string;
    primaryGenreId: string;
    primaryGenre?: GenresData;
    subGenreId: string;
    subGenre?: GenresData;
    labelId: string;
    label?: LabelData;
    title: string;
    version: string | null;
    status: RELEASES_STATUS;
    type?: RELEASES_TYPE;
    tracks: TrackData[];
    releaseArtists?: ReleaseArtist[];
    coverArtThumbnails?: ReleaseCoverArt | null;
    pLineOwner: string;
    cLineOwner: string;
    catalogId: string | null;
    isVariousArtist: boolean;
    releaseLanguage?: releaseLanguage;
    releaseDate: string;
    releaseTime: string;
    releaseTimezoneId: string | null;
    releaseTerritory: ReleaseTerritory;
    timeZone: TimezoneData | null;
}

export interface ReleasesDataFilter extends CommonParams {
    type?: RELEASES_TYPE;
    status?: RELEASES_STATUS;
    startDateCreated?: string;
    endDateCreated?: string;
    startDateRelease?: string;
    endDateRelease?: string;
    genres?: string;
}

export interface ReleaseTerritory extends CommonParams {
    distributeWorldwide: boolean;
    selectedCountries: string[];
    distributionType: string;
}

export interface releaseLanguage extends CommonParams {
    metadataLanguageCountryId: string | null;
    audioLanguageId: string | null;
    metadataLanguageId: string;
    metadataLanguage?: LanguagesData;
    releaseId: string;
}

export type { TrackData } from '@/modules/tracks/types';
