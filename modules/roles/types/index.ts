import { PermissionData } from '@/modules/permission/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface RolesData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    name: string;
    color: string;
    note: string;
    rolePermissions: RolePermission[];
}

export interface RolePermission {
    id: string;
    permissionId: string;
    permission: PermissionData;
}

export interface RolesDataDataFilter extends CommonParams {
    startDateCreated?: string;
    endDateCreated?: string;
}
