import { ChannelsData } from '@/modules/channels/types';
import { CountriesData } from '@/modules/countries/types';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { GenresData } from '@/modules/genres/types';
import { LabelData } from '@/modules/labels/types';
import { LanguagesData } from '@/modules/languages/types';
import { ReleaseArtist } from '@/modules/release-artist/types';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import { RELEASE_CI_DATA_STATUS } from '@/modules/release-distribution/enums';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { TenantData } from '@/modules/tenant/types/data';
import { TimezoneData } from '@/modules/timezone/types';
import { TrackData } from '@/modules/tracks/types';
import { FileBucket } from '@/modules/upload/types/data';
import { UserData } from '@/modules/user/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import {
    RELEASE_ERROR_APPROVAL_STATUS,
    RELEASE_ERROR_ORDER_FIELD,
    RELEASE_ERROR_SUBMISSION_STATUS,
    RELEASE_ERROR_TYPE,
    RELEASE_REVIEW_STATUS,
    RELEASE_TIME_MODE,
    RELEASE_TYPE,
    RELEASES_STATUS,
} from '../enums';

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
    tenant?: Pick<TenantData, 'id' | 'name' | 'logo'>;
    tenantId?: string;
    releaseTimeMode: RELEASE_TIME_MODE;
    logs: string;
    priceTierId?: string;
    type?: RELEASE_TYPE;
    video?: VideoData;
    metadataExternal?: MetadataExternal;
    isImportedFromReport?: boolean;
    isrc?: string;
    releaseDspDeliveries?: ReleaseDspData[];
}

export interface CoverImage {
    url: string;
    size: string;
    width: number;
    height: number;
}

export interface ExternalMetadata {
    albumId?: string;
    trackId?: string;
    albumUrl?: string;
    trackUrl?: string;
    coverImages: CoverImage[];
    lastSyncedAt: string;
}

export interface MetadataExternal {
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
    channel?: ChannelsData;
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
    label?: string;
    externalId?: string;
    channelId?: string;
}

export interface ReleasesDataSimple
    extends Pick<ReleasesData, 'id' | 'title'> {}

export interface QueryReleaseDspDeliveryItem {
    code: string;
    status: RELEASE_DSP_DELIVERY_STATUS;
}

export interface QueryReleaseDspDelivery {
    include?: QueryReleaseDspDeliveryItem[];
    exclude?: QueryReleaseDspDeliveryItem[];
}

export interface ReleasesDataFilter extends CommonParams {
    type?: RELEASE_TYPE;
    status?: RELEASES_STATUS;
    startDateRelease?: string;
    endDateRelease?: string;
    primaryGenreId?: string;
    artistId?: string;
    labelId?: string;
    albumFormatId?: string;
    releaseId?: string;
    isVariousArtist?: string;
    idInclude?: string;
    isImportedFromReport?: string;
    needsReview?: boolean | string;
    hasError?: boolean | string;
    channelId?: string;
    isrc?: string;
    genres?: string;
    ciDataStatus?: RELEASE_CI_DATA_STATUS;
    neverExported?: boolean | string;
    lastImportIsFailed?: boolean | string;
    needImportAgain?: boolean | string;
    hasQaFlag?: boolean | string;
    dspDelivery?: QueryReleaseDspDelivery;
    tenantIds?: string;
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

export interface ReleaseEnrichedError extends CommonAttribute {
    id: string;
    releaseId: string;
    releaseExecutionId?: string | null;
    stepId?: string | null;
    submissionStatus: RELEASE_ERROR_SUBMISSION_STATUS;
    submitterId?: string | null;
    submitter?: UserData | null;
    approvalStatus: RELEASE_ERROR_APPROVAL_STATUS;
    reviewerId?: string | null;
    reviewer?: UserData | null;
    messageCode?: string | null;
    message: string;
    page?: string | null;
    field?: string | null;
    trackId?: string | null;
    type?: RELEASE_ERROR_TYPE | null;
    releaseReviewId?: string | null;
}

export interface ReleaseEnrichedErrorFilter extends CommonParams {
    releaseId: string;
    submissionStatus?: RELEASE_ERROR_SUBMISSION_STATUS;
    approvalStatus?: RELEASE_ERROR_APPROVAL_STATUS;
    type?: RELEASE_ERROR_TYPE;
    fieldOrder?: RELEASE_ERROR_ORDER_FIELD;
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

export interface ReleaseReview extends CommonAttribute {
    releaseId: string;
    releaseExecutionId: string | null;
    stepId: string | null;
    reviewerId: string | null;
    note: string | null;
    status: RELEASE_REVIEW_STATUS;
    release: ReleasesData;
    reviewer: UserData | null;
}

export interface ReleaseReviewFilter extends CommonParams {
    releaseId?: string;
    status?: RELEASE_REVIEW_STATUS;
}
