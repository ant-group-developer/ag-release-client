import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { GenresData } from '@/modules/genres/types';
import { PlatformData } from '@/modules/platform/types';
import { GENRES } from '@/modules/tracks/enums';
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
    subGenreId: string;
    labelId: string;
    title: string;
    version: string | null;
    status: RELEASES_STATUS;
    type?: RELEASES_TYPE;
    tracks: TrackData[];
    releaseArtists: ReleaseArtists[];
    primaryGenre?: GenresData;
    subGenre?: GENRES;
    coverArtThumbnails?: ReleaseCoverArt;
    pLineOwner: string;
    cLineOwner: string;
    catalogId: string | null;
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
    id: string;
    thumbnail: any;
    releaseType: RELEASES_TYPE | null;
    nameRelease: string;
    version: string;
    isMoreThan4Artists: boolean;
    artists: ArtistData[];
    genres: GENRES | null;
    subGenres: GENRES | null;
    metaDataLanguage: string;
    label: string;
    upc: string;
    catalogId: string;
    cLine: { year: string; name: string };
    pLine: { year: string; name: string };
    tracks?: TrackData[] | null;
    releaseDate: string;
    timezone: string;
    territoryType: any;
    artistsApplyAllTracks: ArtistData[];
    platforms: PlatformData['id'][];
}

export interface ReleaseArtists extends CommonAttribute {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
    artist: ArtistData;
    artistRole: ArtistRoleData;
}
