import { ArtistData } from '@/modules/artist/types';
import { GENRES } from '@/modules/tracks/enums';
import { TrackData } from '@/modules/tracks/types';
import { CommonParams } from '@/types/api';
import { RELEASES_STATUS, RELEASES_TYPE } from '../enums';

export interface ReleasesData {
    id: string;
    title: string;
    releaseId: string;
    type: RELEASES_TYPE;
    labelName: string;
    UPC: string;
    creationDate: string;
    releaseDate: string;
    status: RELEASES_STATUS;
    trackCount: number;
    duration: number;
    thumbnail: string; // Đánh dấu check
    artist: string;
    publisher: string;
    plays: number;
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

export interface ReleaseFormValuesData {
    thumbnail: any;
    releaseType: RELEASES_TYPE | null;
    nameRelease: string;
    version: string;
    isMoreThan4Artists: boolean;
    artists: Pick<ArtistData, 'id' | 'name' | 'role'>[];
    genres: GENRES | null;
    subGenres: GENRES | null;
    metaDataLanguage: string;
    label: string;
    upc: string;
    catalogId: string;
    cLineYear: string;
    pLineYear: string;
    tracks: TrackData[] | null;
    releaseDate: string;
    timeZone: string;
    territory: any;
    platform: any[];
    artistsApplyAllTracks: ArtistData[];
}
