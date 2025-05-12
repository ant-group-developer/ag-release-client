import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder, TypeCountData } from '../types';

export const useGetCountOrderType = (dataFilter: DataFilterOrder, enabled: boolean) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCountType,dataFilter],
        queryFn: () => orderApi.getTypeCount(dataFilter),
        enabled,
    });

    const defaultData: TypeCountData[] = [];
    const countTypeData = data?.data?.data ?? defaultData;

    return {
        countTypeData,
        ...res,
    };
};
