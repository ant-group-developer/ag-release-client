import { AggregatorData, SftpMetadata } from '@/modules/aggregator/types';
import { DspData } from '@/modules/dsp/types';
import { CommonParams } from '@/types/api';
import { DSP_DEAL_TENANT } from '../enums';

export interface TenantDspDataFilter extends CommonParams {
    keyword?: string;
}

export interface TenantDspData {
    dspId: string;
    dsp: DspData;
    isActive: boolean;
    isDefault?: boolean;
    mode: DSP_DEAL_TENANT | null;
    sftpConfigId?: string | null;
    sftpConfig?: {
        id: string;
        ernVersion?: string;
        metadata: SftpMetadata;
    } | null;
    aggregatorId?: string | null;
    aggregator?: AggregatorData | null;
}
