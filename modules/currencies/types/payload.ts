export interface CreateCurrenciesPayload {
    name: string;
    code: string;
}

export interface UpdateCurrenciesPayload
    extends Partial<CreateCurrenciesPayload> {}
