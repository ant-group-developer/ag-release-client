import { CommonAttribute, CommonParams } from '@/types/api';

export interface CountriesData extends CommonAttribute {
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
    regionId: number;
}

export interface CountriesSimpleData
    extends Pick<CountriesData, 'id' | 'name'> {}

export interface CountriesDataFilter extends CommonParams {
    keyword?: string;
    dateCreated?: string;
}
