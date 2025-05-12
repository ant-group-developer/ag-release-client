import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { statisticQueryKeys } from '../constants';
import { StatisticCommonParams } from '../types';

export const useGetProductGroupCount = (params: StatisticCommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: [statisticQueryKeys.getOrderProductGroupCount, params],
        queryFn: () => statisticApis.getOrderProductGroupCount(params),
    });

    const productGroupCountData = data?.data?.data ?? [];

    return {
        productGroupCountData,
        ...res,
    };
};
