import { CommonAttribute, CommonParams } from '@/types/api';

export interface ActionsData extends CommonAttribute {
    name: string;
    code: string;
    note: string;
}

export interface ActionsDataFilter extends CommonParams {}
