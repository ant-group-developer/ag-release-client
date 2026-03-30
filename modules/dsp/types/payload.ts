import { CommonFunction } from '@/types/api';
import { DspRoutingConfig } from '.';

export interface CreateDspPayload {
    name: string;
    picture?: string | null;
    isActive: boolean;
    enablePolicy: boolean;
    codeCi?: string;
}

export interface UpdateDspPayload extends Partial<CreateDspPayload> {}

export interface DeleteDspAction extends CommonFunction {
    dspId: string;
    actionId: string;
}

export interface CreateDspRoutingConfig extends Partial<DspRoutingConfig> {}

export interface UpdateDspRoutingConfig extends CreateDspRoutingConfig {}
