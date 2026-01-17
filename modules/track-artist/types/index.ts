import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackArtistData extends CommonAttribute {
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    trackId: string;
}

export interface TrackArtistDataFilter extends CommonParams {}
