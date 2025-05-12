import { PreviousDate } from './order-statistic';

export interface GroupCount {
    id: string | number;
    nameGroup: string;
    totalCount: number;
    newCount: number;
    inProgressCount: number;
    completedCount: number;
    rejectCount: number;
    overdueCount: number;
    cancelCount: number;
    pendingApprovalCount: number;
    comparison: Omit<GroupCount, 'comparison'> & {
        previousDate: PreviousDate;
    };
}

export interface CurrentData {
    total: number;
    statusCounts: {
        new: number;
        in_progress: number;
        pending_approval: number;
        reject: number;
        completed: number;
        overdue: number;
        cancel: number;
    };
}

export interface CompareData extends CurrentData {
    previousDate: {
        startDate: string;
        endDate: string;
    };
}

export interface OrderStatisticData extends CurrentData {
    comparison: CompareData;
}

export interface OrderProductStatusCount {
    type: string;
    total: number;
    completed: number;
    new: number;
    inProgress: number;
    pendingApproval: number;
    reject: number;
    overdue: number;
    cancel: number;
    comparison: CompareData;
}

export interface StatisticCommonParams {
    startDateDeadline: string;
    endDateDeadline: string;
}

export interface OrderProductDualLineChartData {
    date: string;
    order: number;
    product: number;
}

export interface LineChartData {
    date: string;
    value: number;
}
