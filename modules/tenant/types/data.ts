import { ORDER } from '@/enums/common';
import { DspData } from '@/modules/dsp/types';
import { RolesData } from '@/modules/roles/types';
import { UserData } from '@/modules/user/types/data';
import {
    CommonAttribute,
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
export enum TENANT_DOMAIN_STATUS {
    PENDING = 'pending',
    VERIFYING = 'verifying',
    ACTIVE = 'active',
    FAILED = 'failed',
    EXPIRED = 'expired',
}
export enum TENANT_DOMAIN_SETUP_MODE {
    MANUAL = 'manual',
}
export enum TENANT_DOMAIN_SSL_STATUS {
    PENDING = 'pending',
    INITIALIZING = 'initializing',
    ACTIVE = 'active',
    FAILED = 'failed',
}
export enum DNS_RECORD_TYPE {
    CNAME = 'CNAME',
    TXT = 'TXT',
}
export interface CreateTenantDomainPayload {
    domain: string;
}
export interface TenantDomainData extends CommonAttribute {
    domain: string;
    tenantId: TenantData['id'];
    status: TENANT_DOMAIN_STATUS;
    setupMode: TENANT_DOMAIN_SETUP_MODE;
    cfCustomHostnameId: string | null;
    sslStatus: TENANT_DOMAIN_SSL_STATUS;
    verificationToken: string | null;
    creatorId: string | null;
    modifierId: string | null;
    cfTenantZoneId: string | null;
    verifiedAt: string | null;
    sslActiveAt: string | null;
    lastCheckedAt: string | null;
    lastCheckResult: string | null;
}
export interface TenantDomainDnsRecord {
    type: DNS_RECORD_TYPE;
    name: string;
    value: string;
}
export interface TenantDomainDnsInstructions {
    cnameRecord: TenantDomainDnsRecord;
    txtRecord: TenantDomainDnsRecord;
}
export interface TenantDomainResponse {
    domain: TenantDomainData;
    dnsInstructions: TenantDomainDnsInstructions;
}
export interface CreateTenantDomain extends CommonFunction {
    tenantId: TenantData['id'];
    payload: CreateTenantDomainPayload;
}
export interface VerifyTenantDomain extends CommonFunction {
    tenantId: TenantData['id'];
}
export interface DeleteTenantDomain extends CommonFunction {
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
    data: { dspId: DspData['id']; isActive: boolean; isDefault: boolean }[];
}

export interface UpdateTenantDsp extends CommonFunction {
    payload: UpdateTenantDspPayload;
}

export interface TenantDspData {
    id: string;
    isActive: boolean;
    isDefault: boolean;
    tenantId: TenantData['id'];
    dsp: Pick<DspData, 'id' | 'name'>;
}

export interface TenantDspAgreementData {
    dspId: string;
    agreementId: string | null;
    isActive: boolean;
    mode: string | null;
    dsp: DspData;
}

export interface UpdateTenantDspAgreementPayload {
    items: {
        dspId: string;
        isActive: boolean;
    }[];
}

export interface UpdateTenantDspAgreement extends CommonFunction {
    tenantId: string;
    payload: UpdateTenantDspAgreementPayload;
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

export interface DomainResolveParams {
    domain: string;
}

export interface TenantResolveInfo {
    tenantId: string;
    name: string;
    title: string | null;
    logo: string | null;
    icon: string | null;
    primaryColor: string | null;
}

export interface DomainResolveResponse {
    isPrimaryDomain: boolean;
    domain: string;
    tenant: TenantResolveInfo | null;
}

export interface CfOAuthUrlResponse {
    url: string;
}
