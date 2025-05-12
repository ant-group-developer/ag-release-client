import { DataFilterTopic } from '@/modules/topic/types';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { CountTypeData } from '../types';

export const useGetCountProductType = (
    dataFilter: DataFilterTopic,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getCountType, dataFilter],
        queryFn: () => productApi.getCountType(dataFilter),
        enabled,
    });

    const defaultData: CountTypeData[] = [];
    const countTypeData = data?.data?.data ?? defaultData;

    return {
        countTypeData,
        ...res,
    };
};
