import { CommonAttribute, CommonParams } from '@/types/api';

export interface LanguagesData extends CommonAttribute {
    name: string;
    code: string;
}

export interface LanguageDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
