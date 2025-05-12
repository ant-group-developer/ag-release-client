import { ORDER, UPLOAD_TYPE } from '@/enums/common';
import { ORDER_STATUS } from '@/modules/order/enums';
import { CommonParams } from '@/types/api';

export interface FilterOrderManagement extends CommonParams {
    startDateDeadline?: string;
    endDateDeadline?: string;
    startDateCreated?: string;
    endDateCreated?: string;
    topicId?: string;
    type?: UPLOAD_TYPE;
    status?: ORDER_STATUS;
    order?: ORDER;
}

export interface OrderManagementData {
    userCreatorId: string;
    countOrders: number;
    listOrders: string;
    nameUserCreator: string;
}
