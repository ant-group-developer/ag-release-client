import { CommonAttribute, CommonParams } from '@/types/api';

export interface CurrenciesData extends CommonAttribute {
    name: string;
    code: string;
    creatorId: string;
    modifierId: string;
}

export interface CurrenciesDataFilter extends CommonParams {}
