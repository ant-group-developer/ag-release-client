import { CommonAttribute, CommonParams } from '@/types/api';

export interface IssueLevelData extends CommonAttribute {
    creatorId: string;
    modifierId: string;
    nameVi: string;
    nameEn: string;
    code: string;
    color: string;
    severityRank: number;
    weight: number;
    note: string;
}

export interface IssueLevelDataFilter extends CommonParams {}
