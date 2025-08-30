import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackOriginTypeData extends CommonAttribute {
    name: string;
    code: string;
    creatorId: string;
    modifierId: string;
}
export interface TrackOriginTypeSimpleData
    extends Pick<TrackOriginTypeData, 'id' | 'code' | 'name'> {}

export interface TrackOriginTypeDataFilter extends CommonParams {
    keyword?: string;
    createdAt?: string;
}
