import { CommonAttribute, CommonParams } from '@/types/api';

export interface TrackSensitiveData extends CommonAttribute {
    icon: string;
    name: string;
    code: string;
}

export interface TrackSensitiveFilter extends CommonParams {
    keyword?: string;
}
