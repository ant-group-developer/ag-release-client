import { CommonAttribute, CommonParams } from '@/types/api';

export interface LabelData extends CommonAttribute {
    thumbnail: string | null;
    name: string;
    labelId: string;
    trackCount: number;
}

export interface LabelDataFilter extends CommonParams {
    name?: string;
    labelId?: string;
    startDate?: string;
    endDate?: string;
    dateCreated?: string;
}
