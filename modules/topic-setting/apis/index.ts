import axiosAuth from '@/api/axios-auth';
import { ListResponse } from '@/types/api';
import { TopicAssignee, TopicAssigneePayload } from '../types';

export const topicSettingApi = {
    getTopicAssignee: async () => {
        return axiosAuth.get<ListResponse<TopicAssignee>>('/topic-assignee');
    },

    updateTopicAssignee: async (data: TopicAssigneePayload[]) => {
        return axiosAuth.post<ListResponse<TopicAssignee>>(
            `/topic-assignee/submit-assignee`,
            data
        );
    },
};
