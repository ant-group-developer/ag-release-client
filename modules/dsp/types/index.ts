import { DspActionData } from '@/modules/dsp-action/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface DspData extends CommonAttribute {
    creatorId: string;
    modifierId?: string;
    name: string;
    picture?: string | null;
    isActive: boolean;
    enablePolicy: boolean;
    formatLinks: string[];
    dspActions: DspActionData[];
    code: string;
}

export interface DspDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
