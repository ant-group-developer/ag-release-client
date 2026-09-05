import { TenantData } from '@/modules/tenant/types/data';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface LabelData extends CommonAttribute {
    picture: string | null;
    name: string;
    creatorId: string;
    modifierId: string;
    description: string;
    releaseCount: number;
    code: string;
    trackCount: number;
    tenantId: TenantData['id'];
    tenant: Pick<TenantData, 'id' | 'name'>;
}

export interface LabelSimpleData
    extends Pick<LabelData, 'id' | 'name' | 'code'> {}

export interface LabelDataFilter extends CommonParams {
    keyword?: string;
    tenantIds?: string[] | string;
}
