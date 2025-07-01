import { CommonAttribute, CommonParams } from '@/types/api';

export interface ArtistData extends CommonAttribute {
    name: string;
    picture?: string | null;
    biography: string;
    creatorId: string;
    modifierId?: string;
}

export interface ArtistDataFilter extends CommonParams {
    dateCreated?: string;
}
