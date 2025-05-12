import { ORDER } from '@/enums/common';
import { UserInfoData } from '@/modules/auth/types/common';
import { PriorityData } from '@/modules/priorities/types';
import { ProductTypeData } from '@/modules/product-types/types';
import { PRODUCT_TYPE } from '@/modules/product/enums';
import { TopicData } from '@/modules/topic/types';
import { CommonFunction, CommonParams } from '@/types/api';
import { Dayjs } from 'dayjs';
import { ORDER_STATUS, STATUS_ASSIGNEE, USED_STATUS } from '../enums';

export interface CommentRatingData {
    id: string;
    rate: number;
    comment: string;
    userCreatorId: string;
    userCreator: Pick<UserInfoData, 'id' | 'name'>;
    orderProductId: string;
    dateCreated: string;
    dateUpdated: string;
    orderProduct: OrderProduct;
}

export interface FileData {
    id: string;
    downloadUrl: string;
    fileName: string;
    readUrl: string;
    dateCreated: string;
    fileSizeInByte: number | string;
    googleDriveFileId: string | null;
}

export interface ProductInfor {
    duration?: string | number;
    encoding?: string;
    fileId?: string;
    frameRate?: string | number;
    height?: string | number;
    orientation: string;
    width?: string | number;
    file?: FileData;
    nameUserCreator: string;
    source: string;
}

export interface OrderProduct {
    id: string;
    assigneeId: string;
    productId: string;
    type: string;
    description: string;
    downloadUrl: string;
    note: string;
    width: string;
    height: string;
    orientation: string;
    product: ProductInfor;
    nameAssignee: string;
    status: ORDER_STATUS;
    productType: ProductTypeData;
    approverId: string;
    approverUser: Pick<UserInfoData, 'id' | 'name'>;
}

export interface IllustrativeImageInfor {
    id: string;
    fileId: string;
    fileInfor: FileData;
    file: Pick<FileData, 'id' | 'googleDriveFileId'>;
}

export interface OrderData {
    id: string;
    content: string;
    orderIllustrative: IllustrativeImageInfor[];
    illustrativeImage: any;
    code: string;
    note: string;
    deadline: string;
    userCreatorId: string;
    nameUserCreator: string;
    approverUser: Pick<UserInfoData, 'id' | 'name'>;
    status: ORDER_STATUS;
    // type: string;
    topicId: string;
    dateCreated: string;
    dateUpdated: string;
    topic: Pick<TopicData, 'id' | 'code'>;
    orderProduct?: OrderProduct[];
    creatorUser: Pick<UserInfoData, 'id' | 'name'>;
    urlProduct: string;
    usedStatus: USED_STATUS;
    googleDriveFolderId: string | null;
    priority: PriorityData;
}

export interface DataFilterComment extends CommonParams {
    typeOrderProduct?: PRODUCT_TYPE;
}

export interface DataFilterOrder extends CommonParams {
    status?: string;
    type?: string;
    deadline?: string;
    startDateCreated?: string | Date | Dayjs;
    endDateCreated?: string | Date | Dayjs;
    startDateDeadline?: string | Date | Dayjs;
    endDateDeadline?: string | Date | Dayjs;
    topicId?: string;
    orderBy?: string;
    order?: ORDER;
    creatorId?: string;
    assigneeId?: string;
    usedStatus?: USED_STATUS;
    dateCreated?: string;
    statusAssignee?: STATUS_ASSIGNEE;
    priorityId?: string;
    productTypeId?: string;
    groupIds?: string;
}

export interface CreatePayload<T> extends CommonFunction {
    payload: T;
}

export interface CountDataCommon {
    name: string;
    count: number;
}

export interface StatusCountData {
    name: string;
    count: number;
}

export interface TypeCountData {
    name: string;
    count: number;
}

export interface UseStatusCountData extends CountDataCommon {}
