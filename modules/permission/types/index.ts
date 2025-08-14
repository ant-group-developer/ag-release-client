import { CommonAttribute, CommonParams } from '@/types/api';

export interface PermissionData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    name: string;
    value: string;
}

export interface PermissionDataDataFilter extends CommonParams {
    startDateCreated?: string;
    endDateCreated?: string;
}
