import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { statisticQueryKeys } from '../constants';
import { StatisticCommonParams } from '../types';

export const useGetOrderGroupCount = (params: StatisticCommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: [statisticQueryKeys.getOrderGroupCount, params],
        queryFn: () => statisticApis.getOrderGroupCount(params),
    });

    const orderGroupCountData = data?.data?.data ?? [];

    return {
        orderGroupCountData,
        ...res,
    };
};
