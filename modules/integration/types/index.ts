import { SftpMetadata } from '@/modules/aggregator/types';
import { DspData } from '@/modules/dsp/types';
import { TenantData } from '@/modules/tenant/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface IntegrationData extends CommonAttribute {
    modifierId: string;
    isActive: boolean;
    dspId: string;
    dsp?: DspData;
    tenantId: string;
    tenant?: TenantData;
    agreementType: string;
    connections?: IntegrationConnection[];
}

export interface IntegrationConnection extends CommonAttribute {
    name: string;
    description: string;
    requiresCredentials: boolean;
    agreementType: string;
    protocol: string;
    credentials: SftpMetadata;
}

export interface IntegrationDataFilter extends CommonParams {}
