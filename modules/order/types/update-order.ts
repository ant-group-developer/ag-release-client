import { CommonFunction, CreateFile } from '@/types/api';
import { Key } from 'react';
import { FileData, OrderData } from '.';
import { USED_STATUS } from '../enums';

export interface UpdateOrderPayload {
    dataOrder: {
        id: string;
        code?: string;
        type?: string;
        content?: string;
        deadline?: string;
        topicId?: string;
        illustrativeImageIdListRemove?: FileData['id'][];
        illustrativeImageList?: CreateFile[];
        usedStatus?: USED_STATUS;
        listProductTypeId?: string[];
        priorityId?: string;
    };
    dataOrderProduct?: {
        description?: string;
        productTypeId: string;
    }[];
}

export interface UpdateOrder extends CommonFunction {
    payload: UpdateOrderPayload;
}

export interface CancelOrder extends CommonFunction {
    orderId: OrderData['id'];
}

export interface RestoreOrder extends CommonFunction {
    orderId: OrderData['id'];
}

export interface UpdateUsedStatusPayload {
    listOrderIds: Key[];
    usedStatus: USED_STATUS | null;
}
export interface UpdateUsedStatus extends CommonFunction {
    payload: UpdateUsedStatusPayload;
}
