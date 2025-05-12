import { useQuery } from '@tanstack/react-query';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DataFilterOrder, StatusCountData } from '../types';

export const useGetCountOrderStatus = (
    dataFilter: DataFilterOrder,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.getCountStatus, dataFilter],
        queryFn: () => orderApi.getStatusCount(dataFilter),
        enabled,
    });

    const defaultData: StatusCountData[] = [];
    const countStatusData = data?.data?.data ?? defaultData;

    return {
        countStatusData,
        ...res,
    };
};
