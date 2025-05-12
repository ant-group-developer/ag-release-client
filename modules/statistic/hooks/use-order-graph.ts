import { orderQueryKeys } from '@/modules/order/constants';
import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { LineChartData } from '../types';
import { FilterOrderStatistic } from '../types/order-statistic';

export const useGetOrderGraphData = ({ ...params }: FilterOrderStatistic) => {
    const { data, ...res } = useQuery({
        queryKey: [...orderQueryKeys.all, params],
        queryFn: () => statisticApis.getOrderGraphData(params),
    });

    const defaultData: LineChartData[] = [];
    const orderGraphData = data?.data?.data ?? defaultData;

    return {
        orderGraphData,
        ...res,
    };
};
