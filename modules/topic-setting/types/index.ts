import { ProductTypeData } from '@/modules/product-types/types';
import { CommonFunction } from '@/types/api';

export interface TopicAssignee {
    id: string;
    topicId: string;
    assigneeId?: string;
    approverId?: string;
    productTypeId: string;
    productType?: ProductTypeData;
    rate?: number;
}

export interface TopicAssigneePayload extends Omit<TopicAssignee, 'id'> {}

export interface UpdateTopicAssignee extends CommonFunction {
    payload: TopicAssigneePayload[];
}
