import { CommonAttribute, CommonParams } from '@/types/api';

export interface CountryData extends CommonAttribute {
    name: string;
    iso3: string;
    iso2: string;
    numeric_code: string;
    phoneCode: string;
    capital: string;
    currency: string;
    currencyName: string;
    currencySymbol: string;
    nationality: string;
}

export interface CountryDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
