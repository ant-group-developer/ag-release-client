import { ActionsData } from '@/modules/actions/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface DspActionData extends CommonAttribute {
    dspId: string;
    actionId: string;
    isDefault: boolean;
    action: ActionsData;
}

export interface DspActionDataFilter extends CommonParams {}
