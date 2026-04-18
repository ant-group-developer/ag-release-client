import { ORDER } from '@/enums/common';
import { DspData } from '@/modules/dsp/types';
import { RolesData } from '@/modules/roles/types';
import { UserData } from '@/modules/user/types/data';
import {
    CommonAttributeCreator,
    CommonFunction,
    CommonParams,
} from '@/types/api';
import { TENANT_ORDER_BY, TENANT_TYPE, TENANT_USER_TYPE } from '../enums';

export interface TenantUser {
    id: string;
    type: TENANT_USER_TYPE;
    user: Pick<UserData, 'id' | 'email' | 'name'>;
}

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
    code: string | null;
    domain: string | null;
    primaryColor: string | null;
    email: string;
    isActive: boolean;
    type: TENANT_TYPE;
    parent: TenantDetail | null;
    children: TenantDetail[];
    tenantUser: TenantUser[];
    tenantUserCount: number;
    maxLabels: number;
}

export type TenantActiveData = Pick<
    TenantDetail,
    'id' | 'name' | 'title' | 'logo' | 'icon' | 'type' | 'parent' | 'tenantUser'
>;

export type TenantData = Pick<
    TenantDetail,
    | 'id'
    | 'logo'
    | 'icon'
    | 'title'
    | 'name'
    | 'code'
    | 'email'
    | 'isActive'
    | 'type'
    | 'parent'
    | 'children'
    | 'tenantUser'
    | 'tenantUserCount'
    | 'maxLabels'
>;

export interface UpdateTenantPayload {
    logo?: string;
    icon?: string;
    title?: string;
    name?: string;
    code?: string;
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

export interface UpdateTenantDspPayload {
    tenantId: TenantData['id'];
    data: { dspId: DspData['id']; isActive: boolean }[];
}

export interface UpdateTenantDsp extends CommonFunction {
    payload: UpdateTenantDspPayload;
}

export interface TenantDspData {
    id: string;
    isActive: boolean;
    tenantId: TenantData['id'];
    dsp: Pick<DspData, 'id' | 'name'>;
}

export interface TenantRoleData {
    id: string;
    isActive: boolean;
    tenantId: TenantData['id'];
    role: Pick<RolesData, 'id' | 'name' | 'code' | 'color' | 'note'>;
}

export interface UpdateTenantRolesPayload {
    data: { roleId: string; isActive: boolean }[];
}

export interface UpdateTenantRoles extends CommonFunction {
    tenantId: string;
    payload: UpdateTenantRolesPayload;
}
