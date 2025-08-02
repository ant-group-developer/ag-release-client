import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseTypesData extends CommonAttribute {
    name: string;
    value: string;
    minTrackCount: number;
    maxTrackCount: number;
}

export interface ReleaseTypesDataFilter extends CommonParams {}
