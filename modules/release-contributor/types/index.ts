import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseContributor extends CommonAttribute {
    artistRoleId: string;
    artistRole?: ArtistRoleData;
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    addContributorToTracks: boolean;
}

export interface ReleaseContributorDataFilter extends CommonParams {}
