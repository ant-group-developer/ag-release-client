import { topicQueryKeys } from '@/modules/topic/constants';
import { useQuery } from '@tanstack/react-query';
import { topicSettingApi } from '../apis';

export const useGetTopicAssignee = () => {
    const { data, ...res } = useQuery({
        queryKey: [...topicQueryKeys.getTopicAssignee],
        queryFn: () => topicSettingApi.getTopicAssignee(),
    });

    const topicAssignee = data?.data?.data ?? [];

    return {
        topicAssignee,
        ...res,
    };
};
