import { useQuery } from '@tanstack/react-query';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { DataFilterTopic } from '../types';

export const useGetActiveCount = (
    dataFilter: DataFilterTopic,
    enabled: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...topicQueryKeys.getActiveCount, dataFilter],
        queryFn: () => topicApi.getActiveCount(dataFilter),
        enabled,
    });

    const activeCountData = data?.data?.data || [];

    return {
        activeCountData,
        ...res,
    };
};
