import { useQuery } from '@tanstack/react-query';
import { statisticApis } from '../apis';
import { statisticQueryKeys } from '../constants';
import { TopUserFilter } from '../types/user-statistic';

export const useTopUserCreatorsGraph = ({ ...filter }: TopUserFilter) => {
    const { data, ...res } = useQuery({
        queryKey: [statisticQueryKeys.getTopUserCreators, filter],
        queryFn: () => statisticApis.getTopUserCreators(filter),
    });

    const topUserCreatorsGraph = data?.data?.data ?? [];

    return {
        topUserCreatorsGraph,
        ...res,
    };
};
