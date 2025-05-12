import { CommonFunction } from '@/types/api';
import { TopicData } from '.';

export interface DeleteTopic extends CommonFunction {
    topicId: TopicData['id'];
}
