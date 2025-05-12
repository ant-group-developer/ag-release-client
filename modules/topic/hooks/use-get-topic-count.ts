import { DataFilterOrder } from '@/modules/order/types';
import { useQuery } from '@tanstack/react-query';
import { topicApi } from '../apis';
import { topicQueryKeys } from '../constants';
import { TopicCountData } from '../types';

export const useGetTopicCount = (
    dataFilter: DataFilterOrder,
    enable: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...topicQueryKeys.getTopicCount, dataFilter],
        queryFn: () => topicApi.getTopicCount(dataFilter),
        placeholderData: (prev) => prev,
        enabled: enable,
    });

    const defaultData: TopicCountData[] = [];
    const topicCountData = data?.data?.data ?? defaultData;

    return { topicCountData, ...res };
};
