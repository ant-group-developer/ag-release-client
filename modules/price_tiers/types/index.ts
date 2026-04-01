import { CurrenciesData } from '@/modules/currencies/types';
import { CommonAttribute, CommonParams } from '@/types/api';
import { PRICE_TIER_TYPE } from '../enums';

export interface PriceTiersData extends CommonAttribute {
    code: string;
    currencyId: string;
    isDefault: boolean;
    isActive: boolean;
    amount: number;
    ciCode: string;
    type?: PRICE_TIER_TYPE;
    creatorId: string;
    modifierId: string;
    currency: CurrenciesData;
}

export interface PriceTiersDataFilter extends CommonParams {
    isActive?: boolean;
    type?: string;
}
