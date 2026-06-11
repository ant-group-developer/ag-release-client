import { TenantData } from '@/modules/tenant/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface ChannelsData extends CommonAttribute {
    name: string;
    tenantId: string;
    tenant?: Pick<TenantData, 'id' | 'name'>;
}

export interface ChannelsSimpleData extends Pick<ChannelsData, 'id' | 'name'> {}

export interface ChannelDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
