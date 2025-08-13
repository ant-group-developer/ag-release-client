import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData } from '../types';

export const useGetDetailCountry = (id: CountriesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: countriesQueryKeys.detail(id),
        queryFn: () => countriesApi.getDetail(id),
    });
    const defaultData: CountriesData = {
        name: '',
        iso3: '',
        iso2: '',
        numericCode: '',
        phoneCode: '',
        capital: '',
        currency: '',
        currencyName: '',
        currencySymbol: '',
        nationality: '',
        regionId: 0,
        id: '',
        createdAt: '',
        updatedAt: null,
    };

    return {
        countryData: data?.data?.data ?? defaultData,
        ...res,
    };
};
