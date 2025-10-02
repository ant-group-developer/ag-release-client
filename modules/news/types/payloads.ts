import { CommonFunction } from '@/types/api';
import { NewsData, TranslationData } from '.';

export interface CreateNewsPayload extends Partial<NewsData> {}

export interface UpdateNewsPayload extends CreateNewsPayload {}

export interface CreateTranslationPayload extends Partial<TranslationData> {
    newsPostId?: string;
}

export interface CreateTranslation extends CommonFunction {
    payload: CreateTranslationPayload;
}

export interface UpdateTranslationPayload extends CreateTranslationPayload {}
