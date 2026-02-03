import { DspData } from '@/modules/dsp/types';
import { TrackData } from '@/modules/releases/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface RevenueData extends CommonAttribute {
    reportDate: string;
    dspId: string;
    dsp: DspData;
    countryCode: string;
    currencyCode: string;
    amount: string;
    configuration: string;
    trackId: string;
    track: TrackData;
}
export interface RevenueDataFilter extends CommonParams {
    releaseId?: string;
    artistId?: string;
    trackId?: string;
    labelId?: string;
    dspId?: string;
    tenantId?: string;
}
