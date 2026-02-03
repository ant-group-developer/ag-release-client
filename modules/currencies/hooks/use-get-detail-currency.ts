import { useQuery } from '@tanstack/react-query';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';
import { CurrenciesData } from '../types';

export const useGetDetailCurrency = (id: CurrenciesData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: currenciesQueryKeys.detail(id),
        queryFn: () => currenciesApis.getDetail(id),
    });

    const defaultData: CurrenciesData = {
        name: '',
        code: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        creatorId: '',
        modifierId: '',
    };

    return {
        currencyData: data?.data?.data ?? defaultData,
        ...res,
    };
};
