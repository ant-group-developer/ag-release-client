import { TopicCountData } from '@/modules/topic/types';
import { CommonDataSidebar } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { DataFilterProduct } from '../types';

export const useGetProductTopicCount = (
    dataFilter: DataFilterProduct,
    enable: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getCountTopic, dataFilter],
        queryFn: () => productApi.getCountTopic(dataFilter),
        placeholderData: (prev) => prev,
        enabled: enable,
    });

    const defaultData: TopicCountData[] = [];
    const topicCountData = data?.data?.data ?? defaultData;

    return { topicCountData, ...res };
};

export const useGetProductAssigneeCount = (
    dataFilter: DataFilterProduct,
    enable: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getCountAssignee, dataFilter],
        queryFn: () => productApi.getCountAssignee(dataFilter),
        placeholderData: (prev) => prev,
        enabled: enable,
    });

    const defaultData: CommonDataSidebar[] = [];
    const assigneeCountData = data?.data?.data ?? defaultData;

    return { assigneeCountData, ...res };
};

export const useGetProductCreatorCount = (
    dataFilter: DataFilterProduct,
    enable: boolean
) => {
    const { data, ...res } = useQuery({
        queryKey: [...productQueryKeys.getCountCreator, dataFilter],
        queryFn: () => productApi.getCountCreator(dataFilter),
        placeholderData: (prev) => prev,
        enabled: enable,
    });

    const defaultData: CommonDataSidebar[] = [];
    const creatorCountData = data?.data?.data ?? defaultData;

    return { creatorCountData, ...res };
};
