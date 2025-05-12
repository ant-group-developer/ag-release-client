import { CommonAttribute, CommonParams } from '@/types/api';

export interface DataFilterGroup extends CommonParams {}

export interface GroupData extends CommonAttribute {
    name: string;
    description: string | null;
}

export interface GroupDetail extends GroupData {}
