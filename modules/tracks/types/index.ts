import { OriginType } from '@/components/ui/select/original-type-select';
import { CountriesData } from '@/modules/countries/types';
import { GenresData } from '@/modules/genres/types';
import { LanguagesData } from '@/modules/languages/types';
import { ReleasesData } from '@/modules/releases/types';
import { TrackArtistData } from '@/modules/track-artist/types';
import { TrackOriginTypeData } from '@/modules/track-origin-types/types';
import { TrackTypeData } from '@/modules/track-types/types';
import { AudioFileBucket } from '@/modules/upload/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

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
    release: Pick<
        ReleasesData,
        'id' | 'title' | 'label' | 'coverArtThumbnails'
    >;
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

export interface TrackDataFilter extends CommonParams {
    releaseId?: string;
    artistId?: string;
}
