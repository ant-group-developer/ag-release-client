import { CommonAttribute, CommonParams } from '@/types/api';

export interface PermissionData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    name: string;
    code: string;
    note: string;
    isActive: boolean;
}

export interface PermissionSimpleData
    extends Pick<PermissionData, 'id' | 'code' | 'name'> {}

export interface PermissionDataDataFilter extends CommonParams {
    startDateCreated?: string;
    endDateCreated?: string;
    isActive?: boolean;
}
