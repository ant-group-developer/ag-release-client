import { TYPE_GRAPH, TYPE_SELECT } from '@/enums/common';
import { ORDER_TYPE } from '@/modules/order/enums';
import { CommonParams } from '@/types/api';

export interface PreviousDate {
    startDate: string;
    endDate: string;
}

export interface CompareData extends OrderStatusCount {
    previousDate: PreviousDate;
}

export interface OrderStatusCount {
    total: number;
    statusCounts: {
        completed: number;
        new: number;
        in_progress: number;
        pending_approval: number;
        reject: number;
        overdue: number;
        cancel: number;
    };
    comparison: Omit<CompareData, 'comparison'> & {
        previousDate: PreviousDate;
    };
}

export interface OrderStatisticData extends OrderStatusCount {
    comparison: CompareData;
}

export interface FilterOrderStatistic extends CommonParams {
    startDate: string;
    endDate: string;
    type: TYPE_GRAPH;
    typeSelect: TYPE_SELECT;
    typeOrder?: ORDER_TYPE;
    productTypeId?: string;
    userCreatorId?: string;
}

export interface OrderGraphData {
    data: string;
    value: string;
}
