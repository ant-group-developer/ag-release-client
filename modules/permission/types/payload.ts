import { CommonFunction } from '@/types/api';
import { Key } from 'react';

export interface CreatePermissionPayload {
    name: string;
    value: string;
}

export interface UpdatePermissionPayload
    extends Partial<CreatePermissionPayload> {}

export interface BulkCreatePermissionPayload {
    permissions: CreatePermissionPayload[];
}

export interface BulkDeletePermission extends CommonFunction {
    ids: Key[];
}
