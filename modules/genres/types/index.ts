import { CommonAttribute, CommonParams } from '@/types/api';
import { GENRE_SCOPE } from '../enums';

export interface GenresData extends CommonAttribute {
    name: string;
    code: string;
    picture?: string | null;
    description: string;
    scope?: GENRE_SCOPE;
}

export interface GenresSimpleData
    extends Pick<GenresData, 'id' | 'code' | 'name'> {}

export interface GenresDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
    scope?: GENRE_SCOPE;
}


