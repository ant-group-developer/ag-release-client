import { CommonAttribute, CommonParams } from '@/types/api';

export interface TimezoneData extends CommonAttribute {
    name: string;
    utc: string;
    zone: string;
}

export interface TimezoneDataFilter extends CommonParams {}
