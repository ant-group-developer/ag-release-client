import { DealTypeData } from '@/modules/deal-types/types';
import { DspData } from '@/modules/dsp/types';
import { CommonAttribute, CommonParams } from '@/types/api';
import { DSP_DEAL_VISIBILITY } from '../enums';

export interface DspDealData extends CommonAttribute {
    visibility: DSP_DEAL_VISIBILITY;
    dspId: string;
    dealTypeId: string;
    dsp?: DspData;
    dealType?: DealTypeData;
}

export interface DspDealDataFilter extends CommonParams {
    dspId: string;
}
