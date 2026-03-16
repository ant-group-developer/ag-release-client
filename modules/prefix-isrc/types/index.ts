import type { CommonAttribute, CommonParams } from '@/types/api';

export interface PrefixIsrcData extends CommonAttribute {
    code: string;
    maxQuantity: number;
    usedQuantity: string;
    remainingQuantity: number;
}

export interface PrefixIsrcDataFilter extends CommonParams {
    search?: string;
}
