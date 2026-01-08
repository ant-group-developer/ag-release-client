import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackArtistData extends CommonAttribute {
    // artistRoleId: string;        on removing
    // artistRole?: ArtistRoleData; on removing
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    trackId: string;
}

export interface TrackArtistDataFilter extends CommonParams {}
