import { DspData } from '@/modules/dsp/types';
import { ReleasesData } from '@/modules/releases/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ReleaseLogData extends CommonAttribute {
    releaseId: string;
    dspCode: string;
    dspId: string;
    logs: string;
    content: string;
    status: string;
    step: string;
    release: ReleasesData;
    dsp?: DspData;
}

export interface ReleaseLogFilter extends CommonParams {
    releaseId?: string;
    status?: string;
    startCreatedAt?: string;
    endCreatedAt?: string;
    dspIds?: string;
}
