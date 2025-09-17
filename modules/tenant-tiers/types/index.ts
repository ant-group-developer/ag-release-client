import { CommonAttribute, CommonParams } from '@/types/api';

export interface TenantTiersData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    nameVi: string;
    nameEn: string;
    code: string;
    color: string;
    minScore: number;
    maxScore: number;
    note: string;
    description: string;
}

export interface TenantTiersDataFilter extends CommonParams {}
