import { CommonAttribute, CommonParams } from '@/types/api';

export interface LabelData extends CommonAttribute {
    picture: string | null;
    name: string;
    creatorId: string;
    modifierId: string;
    description: string;
}

export interface LabelDataFilter extends CommonParams {
    keyword?: string;
}
