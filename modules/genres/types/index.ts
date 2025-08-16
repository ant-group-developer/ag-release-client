import { CommonAttribute, CommonParams } from '@/types/api';

export interface GenresData extends CommonAttribute {
    name: string;
    code: string;
    picture?: string | null;
    description: string;
}

export interface GenresDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
