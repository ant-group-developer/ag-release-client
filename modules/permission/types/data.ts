import { GroupData } from '@/modules/group/types/data';
import { TopicData } from '@/modules/topic/types';
import { UserData } from '@/modules/user/types/data';
import { CommonParams } from '@/types/api';
import { PERMISSION_BASE_ON } from '../constants';

export type TopicPermission = TopicData['id'];

export interface PermissionData {
    topic: TopicPermission[];
}

export interface DataFilterPermission extends CommonParams {
    groupId: GroupData['id'] | undefined;
    userId: UserData['id'] | undefined;
    type: PERMISSION_BASE_ON;
}
