import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { statisticQueryKeys } from '../constants';
import { TopUserFilter } from '../types/user-statistic';

export const useTopUserCompletedGraph = ({
    typeOrder,
    ...filter
}: TopUserFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [statisticQueryKeys.getTopUserCompleted, filter],
        queryFn: () => statisticApis.getTopUserCompleted(filter),
    });

    const topUserCompletedGraph = data?.data?.data ?? [];

    return {
        topUserCompletedGraph,
        ...res,
    };
};
