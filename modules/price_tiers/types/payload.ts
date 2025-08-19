export interface CreatePriceTiersPayload {
    currencyId: string;
    isDefault: boolean;
    isActive: boolean;
    amount: number;
}

export interface UpdatePriceTiersPayload
    extends Partial<CreatePriceTiersPayload> {}
