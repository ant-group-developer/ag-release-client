import { STATUS_ASSIGNEE } from '@/modules/order/enums';
import { FileData } from '@/modules/order/types';
import { TopicAssignee } from '@/modules/topic-setting/types';
import { UserData } from '@/modules/user/types/data';
import { CommonParams } from '@/types/api';

export interface TopicData {
    id: string;
    parent?: TopicData;
    parentId?: string;
    code: string;
    isActive: boolean;
    description: string;
    note: string;
    order: number;
    children?: TopicData[];
    illustrativeImage: any;
    imageIllustrativeId: string | null;
    imageIllustrative: Pick<FileData, 'id' | 'googleDriveFileId'> | null;
    dateCreated: string;
    dateUpdated: string;
    googleDriveFolderId: string | null;
    creatorUser: UserData;
    totalActiveChildren: number;
    totalInactiveChildren: number;
}

export interface TopicDetailData extends TopicData {
    topicAssignee: TopicAssignee[];
}

export interface DataFilterTopic extends CommonParams {
    isActive?: string;
    statusAssignee?: STATUS_ASSIGNEE;
}

export interface TopicCountData {
    id: string;
    code: string;
    parentCode: string;
    count: number;
    children: TopicCountData[];
}

export interface TopicActiveCountData {
    name: boolean;
    count: number;
}
