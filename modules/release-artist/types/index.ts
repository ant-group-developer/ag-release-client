import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { CommonAttribute } from '@/types/api';

export interface ReleaseArtist extends CommonAttribute {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
    artist?: ArtistData;
    artistRole?: ArtistRoleData;
    addArtistToTracks: boolean;
}
