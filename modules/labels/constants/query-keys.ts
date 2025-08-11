import { QUERY_KEY } from '@/constants/query-key';
import { LabelDataFilter } from '../types';

export const labelsQueryKeys = {
    all: [QUERY_KEY.LABELS.KEY] as const,

    lists: () => [...labelsQueryKeys.all, QUERY_KEY.LABELS.GET_LIST] as const,
    list: (params?: LabelDataFilter) =>
        params
            ? ([...labelsQueryKeys.lists(), params] as const)
            : labelsQueryKeys.lists(),

    details: () =>
        [...labelsQueryKeys.all, QUERY_KEY.LABELS.GET_DETAIL] as const,
    detail: (id: string) => [...labelsQueryKeys.details(), id] as const,
};
