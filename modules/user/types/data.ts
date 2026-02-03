import { ORDER } from '@/enums/common';
import { PermissionData } from '@/modules/permission/types';
import { RolesData } from '@/modules/roles/types';
import { TENANT_USER_TYPE } from '@/modules/tenant/enums';
import { TenantData } from '@/modules/tenant/types/data';
import {
    CommonAttributeCreator,
    CommonFunction,
    CommonParams,
} from '@/types/api';
import { USER_ORDER_BY, USER_TYPE } from '../enums';

export interface DataFilterUser extends CommonParams {
    isActive?: 'true' | 'false';
    orderBy: ORDER;
    fieldOrder: USER_ORDER_BY;
    id?: string;
    type?: string;
    tenantIds?: string;
    status?: string;
}

export interface UserDetail extends CommonAttributeCreator {
    name: string | null;
    email: string;
    isActive: boolean;
    emailVerified: boolean;
    avatar: string | null;
    telegramId: string | null;
    lastLogin: string | null;
    lastIp: string | null;
    type: USER_TYPE;
    tenantUser: {
        id: string;
        type: TENANT_USER_TYPE;
        tenant: Pick<TenantData, 'id' | 'name'>;
    }[];
}

export type UserData = Pick<
    UserDetail,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'name'
    | 'email'
    | 'avatar'
    | 'type'
    | 'isActive'
    | 'lastLogin'
    | 'creator'
    | 'modifier'
    | 'tenantUser'
> & {};

export interface UpdateUserPayload {
    name?: string;
    email?: string;
    avatar?: string;
    telegramId?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    type?: USER_TYPE;
}

export interface UpdateUser extends CommonFunction {
    payload: UpdateUserPayload;
    userId: UserData['id'];
}
export interface CreateUserPayload extends UpdateUserPayload {
    email: string;
    password: string;
}

export interface CreateUser extends CommonFunction {
    payload: CreateUserPayload;
}
export interface InviteUserPayload {
    email: string;
    type: TENANT_USER_TYPE;
}

export interface InviteUser extends CommonFunction {
    payload: InviteUserPayload;
}
export interface UpdateUserRolePayload {
    userId: string;
    roleIds: string[];
}

export interface UpdateUserRole extends CommonFunction {
    payload: UpdateUserRolePayload;
}

export interface SyncUserData extends CommonFunction {}

export interface RemoveUserData extends CommonFunction {
    userId: string;
}

export type UserRoleData = Pick<RolesData, 'id' | 'name' | 'code' | 'note'>;
export type UserPermissionData = Pick<
    PermissionData,
    'id' | 'name' | 'code' | 'note'
>;

export interface BulkUpdateTenantUserPayload {
    userId: string;
    data: {
        type: TENANT_USER_TYPE.ADMIN | TENANT_USER_TYPE.MEMBER;
        tenantId: string;
    }[];
}

export interface BulkUpdateTenantUser extends CommonFunction {
    payload: BulkUpdateTenantUserPayload;
}
