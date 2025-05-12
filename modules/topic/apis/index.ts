import axiosAuth from '@/api/axios-auth';
import { DataFilterOrder } from '@/modules/order/types';
import {
    DataFilterTopic,
    TopicActiveCountData,
    TopicCountData,
    TopicData,
    TopicDetailData,
} from '@/modules/topic/types';
import { DetailResponse, ListResponse } from '@/types/api';
import {
    CreateTopicPayload,
    CreateTopicPayloadWithConfig,
} from '../types/create-topic';
import {
    UpdateTopicOrderPayload,
    UpdateTopicPayload,
    UpdateTopicWithConfigPayload,
} from '../types/update-topic';

export const topicApi = {
    getList: (params: DataFilterTopic) => {
        return axiosAuth.get<ListResponse<TopicData>>('/topics', { params });
    },

    getDetail: (topicId: TopicData['id']) => {
        return axiosAuth.get<DetailResponse<TopicDetailData>>(
            `/topics/${topicId}`
        );
    },

    getListAll: () => {
        return axiosAuth.get<ListResponse<TopicData>>('/topics/all');
    },

    createTopic: (payload: CreateTopicPayload) => {
        return axiosAuth.post<DetailResponse<TopicData>>('/topics', payload);
    },

    createTopicWithConfig: (payload: CreateTopicPayloadWithConfig) => {
        return axiosAuth.post<DetailResponse<TopicData>>(
            '/topic-topic-assignee',
            payload
        );
    },

    updateTopic: (topicId: TopicData['id'], payload: UpdateTopicPayload) => {
        return axiosAuth.patch<DetailResponse<TopicData>>(
            `/topics/${topicId}`,
            payload
        );
    },

    updateTopicWithConfig: (
        topicId: TopicData['id'],
        payload: UpdateTopicWithConfigPayload
    ) => {
        return axiosAuth.patch<DetailResponse<TopicDetailData>>(
            `/topic-topic-assignee/${topicId}`,
            payload
        );
    },

    deleteTopic: (topicId: TopicData['id']) => {
        return axiosAuth.delete(`/topics/${topicId}`);
    },

    updateTopicOrder: (payload: UpdateTopicOrderPayload) => {
        return axiosAuth.patch<DetailResponse<TopicData>>(
            '/topics/update-position',
            payload
        );
    },

    getTopicCount: (dataFilter: DataFilterOrder) => {
        return axiosAuth.get<ListResponse<TopicCountData>>(
            '/orders/sidebar/topic',
            {
                params: dataFilter,
            }
        );
    },

    getActiveCount: (dataFilter: DataFilterTopic) => {
        return axiosAuth.get<ListResponse<TopicActiveCountData>>(
            '/topics/sidebar/status',
            {
                params: dataFilter,
            }
        );
    },
};
