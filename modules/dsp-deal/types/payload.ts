import { DspDealData } from '.';

export interface CreateDspDealPayload extends Partial<DspDealData> {
    dspId: string;
}

export interface UpdateDspDealPayload extends CreateDspDealPayload {}
