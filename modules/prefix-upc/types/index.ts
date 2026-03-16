import type { CommonAttribute, CommonParams } from '@/types/api';

export interface PrefixUpcData extends CommonAttribute {
    code: string;
    brandName: string;
    maxQuantity: number;
    usedQuantity: string;
    remainingQuantity: number;
}

export interface PrefixUpcDataFilter extends CommonParams {
    search?: string;
}
