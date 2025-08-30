import { useQuery } from '@tanstack/react-query';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';

export const useGetListSimpleCurrencies = () => {
    const { data, ...res } = useQuery({
        queryKey: currenciesQueryKeys.listsSimple(),
        queryFn: () => currenciesApis.getListSimple(),
        placeholderData: (prev) => prev,
    });

    const currenciesData = data?.data?.data ?? [];

    return {
        currenciesData,
        ...res,
    };
};
