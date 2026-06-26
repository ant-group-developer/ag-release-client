import { CountriesData } from '@/modules/countries/types';
import { GenresData } from '@/modules/genres/types';
import { LabelData } from '@/modules/labels/types';
import { LanguagesData } from '@/modules/languages/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { TenantData } from '@/modules/tenant/types/data';
import { TimezoneData } from '@/modules/timezone/types';
import { TrackData } from '@/modules/tracks/types';
import { FileBucket } from '@/modules/upload/types/data';
import { UserData } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import { RELEASE_TIME_MODE, RELEASE_TYPE, RELEASES_STATUS } from '../enums';

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
    modifier: UserData;
    upc: string;
    primaryGenreId: string;
    primaryGenre?: GenresData;
    subGenreId: string;
    subGenre?: GenresData;
    labelId: string;
    label?: LabelData;
    // isSensitiveContent: boolean;
    title: string;
    version: string | null;
    status: RELEASES_STATUS;
    albumFormatId: ReleaseTypesData['id'];
    albumFormat: ReleaseTypesData;
    tracks: TrackData[];
    releaseArtists?: ReleaseArtist[];
    releaseContributors?: ReleaseContributor[];
    coverArtThumbnails?: ReleaseCoverArt | null;
    pLineOwner: string;
    cLineOwner: string;
    cLineYear: number | null;
    pLineYear: number | null;
    catalogId: string | null;
    isVariousArtist: boolean;
    isInstrumental: boolean;
    releaseLanguage?: ReleaseLanguage;
    releaseDate: string;
    releaseOriginalDate: string;
    releaseEndDate?: string | null;
    releaseTime: string;
    releaseTimezoneId: string | null;
    releaseTerritory: ReleaseTerritory;
    timeZone: TimezoneData | null;
    tracksCount: number;
    totalDuration: number;
    tenant?: Pick<TenantData, 'id' | 'name'>;
    releaseTimeMode: RELEASE_TIME_MODE;
    logs: string;
    priceTierId?: string;
    type?: RELEASE_TYPE;
    video?: VideoData;
    metadataExternal?: ReleaseMetadataExternal;
    isImportedFromReport?: boolean;
    isrc?: string;
}

export interface SpotifyCoverImage {
    url: string;
    size: string;
    width: number;
    height: number;
}

export interface ExternalMetadata {
    albumId: string;
    albumUrl: string;
    coverImages: SpotifyCoverImage[];
    lastSyncedAt: string;
}

export interface ReleaseMetadataExternal {
    spotify?: ExternalMetadata;
    deezer?: ExternalMetadata;
    [key: string]: ExternalMetadata | undefined;
}

export interface VideoData {
    id?: string;
    releaseId: string;
    isrc: string;
    explicit: boolean;
    aiContent: string;
    channel: string;
    title?: string;
    description?: string;
    keywords?: string[];
    madeForKids: string;
    isUnlisted: boolean;
    subtitles?: string[];
    contentProvider?: string;
    copyrightOwner?: string;
    partnerCustomId1?: string;
    partnerCustomId2?: string;
    fileId?: string;
    videoFile?: FileBucket;
}

export interface ReleasesDataSimple
    extends Pick<ReleasesData, 'id' | 'title'> {}

export interface ReleasesDataFilter extends CommonParams {
    type?: RELEASE_TYPE;
    status?: RELEASES_STATUS;
    startDateCreated?: string;
    endDateCreated?: string;
    startDateRelease?: string;
    endDateRelease?: string;
    genres?: string;
    artistId?: string;
    labelId?: string;
    albumFormatId?: string;
    releaseId?: string;
    isVariousArtist?: string;
    idInclude?: string;
    isImportedFromReport?: string;
}

export interface ReleaseTerritory extends CommonParams {
    distributeWorldwide?: boolean;
    selectedCountries?: string[];
    distributionType?: string;
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
    trackId?: string;
}

export interface ReleaseEnrichedError {
    id: string;
    messageCode: string;
    message: string;
    page: string;
    field: string;
    isFixed: boolean;
}

export type { TrackData } from '@/modules/tracks/types';

export interface ReleaseCaptionData extends CommonAttribute {
    releaseId: string;
    languageId: string;
    type: string;
    fileId: string;
    file?: FileBucket;
    language?: LanguagesData;
}
