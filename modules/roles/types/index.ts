import { PermissionData } from '@/modules/permission/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface RolesData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    name: string;
    color: string;
    code: string | null;
    note: string | null;
    rolePermissions: RolePermission[];
    isActive: boolean;
    isDefault: boolean;
}

export interface RolePermission {
    id: string;
    permissionId: string;
    permission: PermissionData;
}

export interface RolesDataDataFilter extends CommonParams {
    startDateCreated?: string;
    endDateCreated?: string;
    isActive?: 'true' | 'false';
}
