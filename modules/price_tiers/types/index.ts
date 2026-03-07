import { CurrenciesData } from '@/modules/currencies/types';
import { CommonAttribute, CommonParams } from '@/types/api';

export interface PriceTiersData extends CommonAttribute {
    code: string;
    currencyId: string;
    isDefault: boolean;
    isActive: boolean;
    amount: number;
    creatorId: string;
    modifierId: string;
    currency: CurrenciesData;
}

export interface PriceTiersDataFilter extends CommonParams {}
