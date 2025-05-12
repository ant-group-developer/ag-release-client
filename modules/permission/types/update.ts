import { GroupData } from '@/modules/group/types/data';
import { TopicData } from '@/modules/topic/types';
import { CommonFunction } from '@/types/api';

export interface UpdatePermissionPayload {
    listTopicId: TopicData['id'][];
}

export interface UpdateUserPermission extends CommonFunction {
    userId: string;
    payload: UpdatePermissionPayload;
}

export interface UpdateGroupPermission extends CommonFunction {
    groupId: GroupData['id'];
    payload: UpdatePermissionPayload;
}
