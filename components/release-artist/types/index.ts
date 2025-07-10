import { CommonAttribute } from '@/types/api';

export interface ReleaseArtist extends CommonAttribute {
    artistRoleId: string;
    artistId: string;
    releaseId: string;
}
