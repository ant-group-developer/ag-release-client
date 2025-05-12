import { orderQueryKeys } from '@/modules/order/constants';
import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import {
    FilterOrderStatistic,
    OrderStatusCount,
} from '../types/order-statistic';

export const useGetOrderStatus = ({ ...params }: FilterOrderStatistic) => {
    const { data, ...res } = useQuery({
        queryKey: [orderQueryKeys.getStatistic, params],
        queryFn: () => statisticApis.getOrdersStatus(params),
    });

    const defaultData: OrderStatusCount = {
        total: 0,
        statusCounts: {
            completed: 0,
            new: 0,
            in_progress: 0,
            pending_approval: 0,
            reject: 0,
            overdue: 0,
            cancel: 0,
        },
        comparison: {
            total: 0,
            statusCounts: {
                completed: 0,
                new: 0,
                in_progress: 0,
                pending_approval: 0,
                reject: 0,
                overdue: 0,
                cancel: 0,
            },
            previousDate: {
                startDate: '',
                endDate: '',
            },
        },
    };

    const orderStatusData = data?.data?.data ?? defaultData;

    return {
        orderStatusData,
        ...res,
    };
};
