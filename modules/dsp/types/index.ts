import { AggregatorData, SftpMetadata } from '@/modules/aggregator/types';
import { DspActionData } from '@/modules/dsp-action/types';
import { CommonAttribute, CommonParams } from '@/types/api';
import { DSP_DEAL } from '../enums';

export interface DspData extends CommonAttribute {
    creatorId: string;
    modifierId?: string;
    name: string;
    picture?: string | null;
    isActive: boolean;
    isDefault: boolean;
    hasDeal: boolean;
    enablePolicy: boolean;
    formatLinks: string[];
    dspActions: DspActionData[];
    code: string;
    codeCi?: string;
    ddexId?: string;
    ddexName?: string;
    dspRoutingConfig?: DspRoutingConfig;
}

export interface DspDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
    aggregatorCode?: string;
}

export interface DspRoutingConfig extends CommonAttribute {
    dspId: DspData['id'];
    mode: DSP_DEAL | null;
    aggregatorId?: string;
    aggregator?: AggregatorData;
    sftpConfig?: {
        id: string;
        metadata: SftpMetadata;
    };
}
