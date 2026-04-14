import { CommonAttribute, CommonParams } from '@/types/api';

export interface ArtistRoleData extends CommonAttribute {
    name: string;
    code: string;
    isRequired: boolean;
    creatorId: string;
    modifierId: string;
}

export interface ArtistRoleSimpleData
    extends Pick<ArtistRoleData, 'id' | 'name' | 'code' | 'isRequired'> {}

export interface ArtistRoleDataFilter extends CommonParams {
    keyword?: string;
    createdAt?: string;
}
