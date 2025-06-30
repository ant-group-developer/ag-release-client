import { CommonAttribute, CommonParams } from '@/types/api';

export interface GenresData extends CommonAttribute {
    name: string;
    picture?: string | null;
    description: string;
}

export interface GenresDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
