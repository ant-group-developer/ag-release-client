import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseArtist extends CommonAttribute {
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    addArtistToTracks: boolean;
}

export interface ReleaseArtistDataFilter extends CommonParams {}
