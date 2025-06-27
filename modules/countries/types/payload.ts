export interface CreateCountryPayload {
    name: string;
    iso3: string;
    iso2: string;
    numericCode: string;
    phoneCode: string;
    capital: string;
    currency: string;
    currencyName: string;
    currencySymbol: string;
    nationality: string;
    regionId?: number;
}

export interface UpdateCountryPayload extends Partial<CreateCountryPayload> {}
