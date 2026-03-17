import { DISTRIBUTION_STATUS } from '@/modules/distribution/enum';
import { DspData } from '@/modules/dsp/types';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { CommonParams } from '@/types/api';

export interface ReleaseDspData {
    dsp: DspData;
    status: RELEASES_STATUS;
    lastEnqueuedAt: string | null;
    lastDeliveredAt: string | null;
}

export interface ReleaseDspDataFilter extends CommonParams {
    status?: DISTRIBUTION_STATUS;
}
