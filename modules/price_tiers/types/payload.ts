import { PRICE_TIER_TYPE } from '../enums';

export interface CreatePriceTiersPayload {
    currencyId: string;
    isDefault: boolean;
    isActive: boolean;
    amount: number;
    ciCode: string;
    type: PRICE_TIER_TYPE;
}

export interface UpdatePriceTiersPayload
    extends Partial<CreatePriceTiersPayload> {}
export interface UpdatePriceTiersOrderPayload {
    priceTiers: {
        id: string;
        order: number;
    }[];
    onSuccess?: () => void;
    onError?: () => void;
}
