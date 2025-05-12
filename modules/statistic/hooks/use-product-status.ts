import { productQueryKeys } from '@/modules/product/constants';
import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { FilterOrderStatistic } from '../types/order-statistic';
import { ProductStatusCount } from '../types/product-statistic';

export const useGetProductStatus = ({
    typeOrder,
    ...params
}: FilterOrderStatistic) => {
    const { data, ...res } = useQuery({
        queryKey: [productQueryKeys.getStatistic, params],
        queryFn: () => statisticApis.getProductStatus(params),
    });

    const defaultData: ProductStatusCount = {
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

    const productStatusData = data?.data?.data ?? defaultData;

    return {
        productStatusData,
        ...res,
    };
};
