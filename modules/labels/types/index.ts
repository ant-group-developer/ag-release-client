import { CommonAttribute, CommonParams } from '@/types/api';

export interface LabelData extends CommonAttribute {
    picture: string | null;
    name: string;
    creatorId: string;
    modifierId: string;
    description: string;
    releaseCount: number;
    trackCount: number;
}

export interface LabelDataFilter extends CommonParams {
    keyword?: string;
}
