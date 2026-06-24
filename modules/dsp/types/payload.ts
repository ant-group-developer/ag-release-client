import { CommonFunction } from '@/types/api';
import { DSP_TYPE } from '../enums';
import { DspRoutingConfig } from '.';

export interface CreateDspPayload {
    name: string;
    type: DSP_TYPE;
    picture?: string | null;
    isActive: boolean;
    hasDeal: boolean;
    enablePolicy: boolean;
    isDefault: boolean;
    codeCi?: string;
}

export interface UpdateDspPayload extends Partial<CreateDspPayload> {}

export interface DeleteDspAction extends CommonFunction {
    dspId: string;
    actionId: string;
}

export interface CreateDspRoutingConfig extends Partial<DspRoutingConfig> {}

export interface UpdateDspRoutingConfig extends CreateDspRoutingConfig {}
