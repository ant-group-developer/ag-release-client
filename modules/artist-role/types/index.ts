import { CommonAttribute, CommonParams } from '@/types/api';

export interface ArtistRoleData extends CommonAttribute {
    name: string;
    value: string;
    creatorId: string;
    modifierId: string;
}

export interface ArtistRoleDataFilter extends CommonParams {
    keyword?: string;
    createdAt?: string;
}
