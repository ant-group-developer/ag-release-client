import { CommonFunction } from '@/types/api';
import { Key } from 'react';

export interface CreatePermissionPayload {
    name: string;
    code: string;
    isActive?: boolean;
    note?: string;
}

export interface UpdatePermissionPayload
    extends Partial<CreatePermissionPayload> {}

export interface BulkCreatePermissionPayload {
    permissions: CreatePermissionPayload[];
}

export interface BulkDeletePermission extends CommonFunction {
    ids: Key[];
}
