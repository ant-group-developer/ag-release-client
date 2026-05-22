import { SftpMetadata } from '@/modules/aggregator/types';
import { DSP_DEAL } from '@/modules/dsp/enums';

export interface UpdateTenantDspPayload {
    mode: DSP_DEAL | 'SYSTEM' | null;
    aggregatorId?: string;
    sftpConfig?: {
        ernVersion?: string;
        metadata: SftpMetadata;
    };
}
