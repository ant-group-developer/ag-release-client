import { TYPE_GRAPH, TYPE_SELECT, UPLOAD_TYPE } from '@/enums/common';
import { CommonParams } from '@/types/api';
import { CompareData } from '.';

export interface ProductStatusCount {
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
        previousDate: {
            startDate: string;
            endDate: string;
        };
    };
}

export interface FilterProductStatistic extends CommonParams {
    startDate: string;
    endDate: string;
    type: TYPE_GRAPH;
    typeSelect: TYPE_SELECT;
    typeOrderProduct?: UPLOAD_TYPE;
}

export interface ProductGraphData {
    data: string;
    value: string;
}
