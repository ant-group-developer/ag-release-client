import { OriginType } from '@/components/ui/select/original-type-select';
import { ActionsData } from '@/modules/actions/types';
import { CountriesData } from '@/modules/countries/types';
import { DspData } from '@/modules/dsp/types';
import { GenresData } from '@/modules/genres/types';
import { LanguagesData } from '@/modules/languages/types';
import { PriceTiersData } from '@/modules/price_tiers/types';
import { ReleasesData } from '@/modules/releases/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TrackOriginTypeData } from '@/modules/track-origin-types/types';
import { TrackTypeData } from '@/modules/track-types/types';
import { AudioFileBucket } from '@/modules/upload/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';
import { SCAN_COPYRIGHT_STATUS } from '../enums';

export interface TrackData extends CommonAttribute {
    title: string;
    picture: string | null;
    version: string | null;
    isrc: string | null;
    iswc: string | null;
    releaseId: string;
    pLineOwner: string | null;
    pLineYear: number | null | undefined;
    primaryGenreId: string | null;
    primaryGenre: GenresData | null;
    subGenreId: string | null;
    subGenre: GenresData | null;
    audioFile?: AudioFileBucket;
    originTypeId: string;
    originType: OriginType;
    trackLanguage?: TrackLanguage;
    trackArtists?: TrackArtistData[];
    isSensitiveContent: boolean;
    lyric: string;
    trackTypeId: string;
    trackType: TrackTypeData | null;
    copyArtistsFromRelease: boolean;
    trackOriginTypeId: string | null;
    trackOriginType: TrackOriginTypeData | null;
    preview: string;
    isScanned: boolean;
    release: Pick<
        ReleasesData,
        'id' | 'title' | 'label' | 'coverArtThumbnails'
    >;
    priceTierId: PriceTiersData['id'];
    priceTier: PriceTiersData;
    trackPolicies: TrackPolicyData[];
    scanCopyrightStatus: SCAN_COPYRIGHT_STATUS;
    isByAi: boolean;
}
export interface TrackDataFilter extends CommonParams {
    releaseId?: string;
    artistId?: string;
    isScanned?: string;
    genres?: string;
    scanCopyrightStatus?: string;
}

export interface TrackPolicyData extends CommonAttribute {
    actionId: string;
    dspId: string;
    dsp: DspData;
    action: ActionsData;
}

export interface TrackLanguage {
    metadataLanguageId: string;
    audioLanguageId: string;
    metadataLanguageCountryId: string;
    recordingCountryId: string;
    recordingCountry: CountriesData | null;
    audioLanguage: LanguagesData | null;
    metadataLanguageCountry: CountriesData | null;
}
