import { CommonParams } from '@/types/api';

export interface LabelData {
    id: string;
    thumbnail: string | null;
    name: string;
    labelId: string;
    trackCount: number;
    createdAt: Date;
}

export interface LabelDataFilter extends CommonParams {
    name?: string;
    labelId?: string;
    startDate?: string;
    endDate?: string;
    dateCreated?: string;
}
