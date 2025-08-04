import { CountriesData } from '@/modules/countries/types';
import { GenresData } from '@/modules/genres/types';
import { LabelData } from '@/modules/labels/types';
import { LanguagesData } from '@/modules/languages/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ReleaseTypesData } from '@/modules/release-types/types';
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
    isSensitiveContent: boolean;
    title: string;
    version: string | null;
    status: RELEASES_STATUS;
    albumFormatId: ReleaseTypesData['id'];
    albumFormat: ReleaseTypesData;
    tracks: TrackData[];
    releaseArtists?: ReleaseArtist[];
    coverArtThumbnails?: ReleaseCoverArt | null;
    pLineOwner: string;
    cLineOwner: string;
    catalogId: string | null;
    isVariousArtist: boolean;
    releaseLanguage?: ReleaseLanguage;
    releaseDate: string;
    releaseTime: string;
    releaseTimezoneId: string | null;
    releaseTerritory: ReleaseTerritory;
    timeZone: TimezoneData | null;
    tracksCount: number;
    totalDuration: number;
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

export interface ReleaseLanguage extends CommonParams {
    metadataLanguageCountryId: string | null;
    metadataLanguageCountry?: CountriesData | null;
    audioLanguageId: string | null;
    audioLanguage?: LanguagesData | null;
    metadataLanguageId: string;
    metadataLanguage?: LanguagesData | null;
    releaseId: string;
}

export interface ReleaseValidate {
    messageCode: string;
    message: string;
    page: string;
    field: string;
}

export type { TrackData } from '@/modules/tracks/types';
