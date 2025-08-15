import { CommonFunction } from '@/types/api';
import { Key } from 'react';

export interface CreateRolePayload {
    name: string;
    color: string;
    description: string;
    rolePermission?: {
        permissionId: string;
    }[];
}

export interface UpdateRolesPayload extends Partial<CreateRolePayload> {}

export interface BulkDeleteRoles extends CommonFunction {
    ids: Key[];
}

export interface DeleteRoleProfile extends CommonFunction {
    roleId: string;
    rolePermissionId: string;
}
