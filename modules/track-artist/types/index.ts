import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackArtistData extends CommonAttribute {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    artistRole?: ArtistRoleData;
    trackId: string;
}

export interface TrackArtistDataFilter extends CommonParams {}
