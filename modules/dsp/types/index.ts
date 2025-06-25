import { CommonAttribute, CommonParams } from '@/types/api';

export interface DspData extends CommonAttribute {
    creatorId: string;
    modifierId?: string;
    name: string;
    picture?: string;
    canLinkArtistProfile: boolean;
}

export interface DspDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
