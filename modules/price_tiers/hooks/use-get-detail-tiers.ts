import { useQuery } from '@tanstack/react-query';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { PriceTiersData } from '../types';

export const useGetDetailPriceTier = (id: PriceTiersData['id']) => {
    const { data, ...res } = useQuery({
        queryKey: priceTiersQueryKeys.detail(id),
        queryFn: () => priceTiersApis.getDetail(id),
    });

    const defaultData: PriceTiersData = {
        currencyId: '',
        isDefault: false,
        isActive: false,
        amount: 0,
        creatorId: '',
        modifierId: '',
        id: '',
        createdAt: '',
        updatedAt: null,
        currency: {
            name: '',
            code: '',
            creatorId: '',
            modifierId: '',
            id: '',
            createdAt: '',
            updatedAt: null,
        },
        code: '',
        ciCode: '',
    };

    return {
        priceTierData: data?.data?.data ?? defaultData,
        ...res,
    };
};
