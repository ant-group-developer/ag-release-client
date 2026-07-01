import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { DspData } from '@/modules/dsp/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseDspData extends CommonAttribute {
    dsp: DspData;
    status: RELEASE_DSP_DELIVERY_STATUS;
    isSelected: boolean;
    lastEnqueuedAt: string | null;
    lastDeliveredAt: string | null;
    issues?: any;
    isActive: boolean;
    hasLiveVersion: boolean;
}

export interface ReleaseDspDataFilter extends CommonParams {
    status?: RELEASE_DSP_DELIVERY_STATUS;
}
