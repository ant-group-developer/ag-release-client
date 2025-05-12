import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';

import { productQueryKeys } from '@/modules/product/constants';
import { LineChartData } from '../types';
import { FilterOrderStatistic } from '../types/order-statistic';

export const useGetProductGraphData = ({
    typeOrder,
    ...params
}: FilterOrderStatistic) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.all, params],
        queryFn: () => statisticApis.getProductGraphData(params),
    });

    const defaultData: LineChartData[] = [];
    const productGraphData = data?.data?.data ?? defaultData;

    return {
        productGraphData,
        ...res,
    };
};
