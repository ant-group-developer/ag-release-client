import { CommonFunction } from '@/types/api';
import { NewsCategoryData } from '.';

export interface CreateNewsCategoryPayload extends Partial<NewsCategoryData> {}

export interface UpdateNewsCategoryPayload extends CreateNewsCategoryPayload {}

export interface BulkUpdateNewsCategoryPayload extends CommonFunction {
    newsCategories: {
        id: string;
        order: number;
    }[];
}
