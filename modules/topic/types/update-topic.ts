import { CommonFunction, CreateFile } from '@/types/api';
import { TopicData } from '.';
import { ListConfigTopic } from './create-topic';

export interface UpdateTopicOrderPayload {
    data: Array<{ id: string; order: number }>;
}

export interface UpdateTopicPayload {
    parentId?: string;
    code?: string;
    description?: string;
    isActive?: boolean;
    note?: string;
    order?: number;
    imageIllustrative?: CreateFile | null;
}

export interface UpdateTopicWithConfigPayload {
    topicData: UpdateTopicPayload;
    listConfigTopic?: ListConfigTopic[];
}

export interface UpdateTopicWithConfig extends CommonFunction {
    topicId: TopicData['id'];
    payload: UpdateTopicWithConfigPayload;
}

export interface UpdateTopic extends CommonFunction {
    topicId: TopicData['id'];
    payload: UpdateTopicPayload;
}

export interface UpdateTopicOrder extends CommonFunction {
    payload: UpdateTopicOrderPayload;
}
