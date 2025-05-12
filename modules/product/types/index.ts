import { ORDER } from '@/enums/common';
import { ORDER_STATUS, STATUS_ASSIGNEE } from '@/modules/order/enums';
import { FileData, OrderData } from '@/modules/order/types';
import { ProductTypeData } from '@/modules/product-types/types';
import { UserData } from '@/modules/user/types/data';
import {
    CommonFunction,
    CommonParams,
    GetUrlUploadParams,
    SubmitUploadParams,
} from '@/types/api';
import { Dayjs } from 'dayjs';
import { Key } from 'react';

export interface ProductData {
    id: string;
    order: OrderData;
    orderId?: string | null;
    assigneeId: string | null;
    assigneeUser: {
        id: string;
        name: string;
    };
    approverUser: {
        id: string;
        name: string;
    };
    productId: string | null;
    product: {
        id: string;
        file: FileData;
    };
    note: string;
    type: string;
    content?: string;
    description: string;
    status: string;
    rate: number;
    productType: ProductTypeData;
    dateCreated: string;
    dateUpdated: string;
}

export interface DataFilterProduct extends CommonParams {
    status?: ORDER_STATUS;
    productTypeId?: string;
    deadline?: string;
    startDateDeadline?: string | Dayjs | Date;
    endDateDeadline?: string | Dayjs | Date;
    startDateCreated?: string | Dayjs | Date;
    endDateCreated?: string | Dayjs | Date;
    order?: ORDER;
    orderBy?: string;
    topicId?: string;
    creatorId?: string;
    assigneeId?: string;
    approverId?: string;
    dateCreated?: string;
    statusAssignee?: STATUS_ASSIGNEE;
    priorityId?: string;
    groupIds?: string;
}

export interface CountTypeData {
    id: string;
    nameVi: string;
    nameEn: string;
    count: number;
}

export interface CountStatusData extends CountTypeData {}

export interface ProductUploadHistoryData {
    id: string;
    dateCreated: string;
    dateUpdated: string;
    orderProductId: string;
    type: string;
    googleDriveFileId: string | null;
    status: ORDER_STATUS;
    creatorUser: Pick<UserData, 'id' | 'name'>;
    productType: ProductTypeData;
}

export interface UploadProductHistoryPayload {
    orderId: string;
}

export interface AssignUserPayload {
    assigneeId?: string;
    approverId?: string;
    listOrderProductId: Key[];
}

export interface RemoveAssigneePayload {
    orderProductIds: Key[];
}

export interface UploadProductPayload extends CommonFunction {
    payload: SubmitUploadParams;
}

export interface GetUrlUploadPayload extends CommonFunction {
    payload: GetUrlUploadParams;
}

export interface UserAssignPayload extends CommonFunction {
    payload: AssignUserPayload;
}

export interface RemoveAssignee extends CommonFunction {
    payload: RemoveAssigneePayload;
}
