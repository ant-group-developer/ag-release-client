import { useQuery } from '@tanstack/react-query';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';

export const useGetListSimpleCountries = () => {
    const { data, ...res } = useQuery({
        queryKey: countriesQueryKeys.listsSimple(),
        queryFn: () => countriesApi.getListSimple(),
        placeholderData: (previousData) => previousData,
        refetchOnWindowFocus: false,
    });

    const dataCountries = data?.data?.data ?? [];

    return {
        countriesData: dataCountries,
        ...res,
    };
};
