import { DspData } from '@/modules/dsp/types';
import { RELEASES_STATUS } from '@/modules/releases/enums';

export interface ReleaseDspData {
    dsp: DspData;
    status: RELEASES_STATUS;
    lastEnqueuedAt: string | null;
    lastDeliveredAt: string | null;
}
