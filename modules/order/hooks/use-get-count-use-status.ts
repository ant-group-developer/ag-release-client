import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder, UseStatusCountData } from '../types';

export const useGetCountUseStatus = (
    dataFilter: DataFilterOrder,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCountUseStatus, dataFilter],
        queryFn: () => orderApi.getUseStatusCount(dataFilter),
        enabled,
    });

    const defaultData: UseStatusCountData[] = [];
    const useStatusCountData = data?.data?.data ?? defaultData;

    return {
        useStatusCountData,
        ...res,
    };
};
