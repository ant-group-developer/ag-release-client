import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseTypesData extends CommonAttribute {
    name: string;
    code: string;
    minTrackCount: number;
    maxTrackCount: number;
}

export interface ReleaseTypesDataFilter extends CommonParams {}
