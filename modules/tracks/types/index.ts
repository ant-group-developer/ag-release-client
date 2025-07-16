import { OriginType } from '@/components/ui/select/original-type-select';
import { TrackArtistData } from '@/modules/track-artist/types';
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
    primaryGenreId: string | null;
    subGenreId: string | null;
    audioFile?: AudioFileBucket;
    originTypeId: string;
    originType: OriginType;
    trackLanguage?: {
        metadataLanguageId: string;
        audioLanguageId: string;
        metadataLanguageCountryId: string;
        recordingCountryId: string;
    };
    trackArtists?: TrackArtistData[];
    isSensitiveContent: boolean;
    lyric: string;
    trackTypeId: string;
    copyArtistsFromRelease: boolean;
    trackOriginTypeId: string | null;
    preview: string;
}

export interface TrackDataFilter extends CommonParams {
    releaseId?: string;
}
