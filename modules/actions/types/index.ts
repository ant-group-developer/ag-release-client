import { CommonAttribute, CommonParams } from '@/types/api';

export interface ActionsData extends CommonAttribute {
    name: string;
    code: string;
    note: string;
}

export interface ActionsSimpleData
    extends Pick<ActionsData, 'id' | 'code' | 'name' | 'note'> {}

export interface ActionsDataFilter extends CommonParams {}
