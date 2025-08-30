import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackTypeData extends CommonAttribute {
    name: string;
    code: string;
    creatorId: string;
    modifierId: string;
}

export interface TrackTypeSimpleData
    extends Pick<TrackTypeData, 'id' | 'code' | 'name'> {}

export interface TrackTypeDataFilter extends CommonParams {
    keyword?: string;
    createdAt?: string;
}
