import { CommonFunction, CreateFile } from '@/types/api';

export interface CreateTopicPayload {
    parentId?: string;
    code?: string;
    description?: string;
    note?: string;
    order: number;
    imageIllustrative?: CreateFile | null;
}

export interface ListConfigTopic {
    productTypeId: string;
    assigneeId?: string;
    approverId?: string;
    rate?: number;
}

export interface CreateTopicPayloadWithConfig {
    topicData: CreateTopicPayload;
    listConfigTopic: ListConfigTopic[];
}

export interface CreateTopic extends CommonFunction {
    payload: CreateTopicPayload;
}

export interface CreateTopicWithConfig extends CommonFunction {
    payload: CreateTopicPayloadWithConfig;
}
