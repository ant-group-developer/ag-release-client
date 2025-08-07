import { ORDER } from '@/enums/common';
import { UserData } from '@/modules/user/types/data';
import {
    CommonAttributeCreator,
    CommonFunction,
    CommonParams,
} from '@/types/api';
import { TENANT_ORDER_BY, TENANT_TYPE } from '../enums';

export interface DataFilterTenant extends CommonParams {
    isActive?: 'true' | 'false';
    orderBy: ORDER;
    fieldOrder: TENANT_ORDER_BY;
    id?: string;
    type?: string;
}

export interface TenantDetail extends CommonAttributeCreator {
    logo: string | null;
    icon: string | null;
    title: string | null;
    name: string;
    domain: string | null;
    primaryColor: string | null;
    email: string;
    isActive: boolean;
    owner: UserData;
    type: TENANT_TYPE;
    parent: TenantDetail | null;
    children: TenantDetail[];
}

export type TenantData = Pick<
    TenantDetail,
    | 'id'
    | 'logo'
    | 'icon'
    | 'title'
    | 'name'
    | 'domain'
    | 'primaryColor'
    | 'email'
    | 'isActive'
    | 'owner'
    | 'type'
    | 'parent'
    | 'children'
>;

export interface UpdateTenantPayload {
    logo?: string;
    icon?: string;
    title?: string;
    name?: string;
    domain?: string;
    email?: string;
    primaryColor?: string;
    isActive?: boolean;
    ownerId?: UserData['id'];
    type?: TENANT_TYPE;
    parentId?: string;
}

export interface UpdateTenant extends CommonFunction {
    payload: UpdateTenantPayload;
    tenantId: TenantData['id'];
}
export interface CreateTenantPayload extends UpdateTenantPayload {
    email: string;
    name: string;
    ownerId: UserData['id'];
    type: TENANT_TYPE;
}

export interface CreateTenant extends CommonFunction {
    payload: CreateTenantPayload;
}
