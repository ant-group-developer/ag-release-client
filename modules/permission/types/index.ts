import { CommonAttribute, CommonParams } from '@/types/api';

export interface PermissionData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    name: string;
    code: string;
    note: string;
}

export interface PermissionDataDataFilter extends CommonParams {
    startDateCreated?: string;
    endDateCreated?: string;
}
