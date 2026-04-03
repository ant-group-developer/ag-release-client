import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { DspData } from '@/modules/dsp/types';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseDspData extends CommonAttribute {
    dsp: DspData;
    status: RELEASES_STATUS;
    isSelected: boolean;
    lastEnqueuedAt: string | null;
    lastDeliveredAt: string | null;
}

export interface ReleaseDspDataFilter extends CommonParams {
    status?: RELEASE_DSP_DELIVERY_STATUS;
}
