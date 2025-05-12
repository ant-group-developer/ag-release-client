import { ORDER } from '@/enums/common';
import { ORDER_STATUS, STATUS_ASSIGNEE } from '@/modules/order/enums';
import { CommonParams } from '@/types/api';

export interface FilterProductManagement extends CommonParams {
    startDateDeadline?: string;
    endDateDeadline?: string;
    startDateCreated?: string;
    endDateCreated?: string;
    topicId?: string;
    productTypeId?: string;
    status?: ORDER_STATUS;
    order?: ORDER;
    statusAssignee?: STATUS_ASSIGNEE;
}

// type TypeItem =
//     | { type: 'image'; data: string[]; count: number }
//     | { type: 'video'; data: string[]; count: number }
//     | { type: 'source'; data: string[]; count: number };

export interface TypeItem {
    productTypeId: string;
    type: string;
    value: string[];
    count: number;
    color: string;
}

export interface ProductManagementData {
    assigneeId: string;
    totalOrderProducts: number;
    assigneeName: string;
    type: TypeItem[];
}

export interface ProductManagementColumn extends ProductManagementData {
    originalIndex: number;
    typeIndex: number;
    rowSpan: number;
    typeName: string;
    typeValue: string[];
    typeCount: number;
    typeColor: string;
    typeId: string;
}
