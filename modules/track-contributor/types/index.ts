import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackContributorData extends CommonAttribute {
    artistRoleId: string;
    artistRole?: ArtistRoleData;
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    trackId: string;
}

export interface TrackContributorDataFilter extends CommonParams {}
