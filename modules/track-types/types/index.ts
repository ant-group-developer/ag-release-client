import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackTypeData extends CommonAttribute {
    name: string;
    value: string;
    creatorId: string;
    modifierId: string;
}

export interface TrackTypeDataFilter extends CommonParams {
    keyword?: string;
    createdAt?: string;
}
