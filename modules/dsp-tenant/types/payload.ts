import { SftpMetadata } from '@/modules/aggregator/types';
import { DSP_DEAL_TENANT } from '../enums';

export interface UpdateTenantDspPayload {
    mode?: DSP_DEAL_TENANT | null;
    aggregatorId?: string;
    isActive?: boolean;
    sftpConfig?: {
        ernVersion?: string;
        metadata: SftpMetadata;
    };
}
