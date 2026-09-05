import { useQuery } from '@tanstack/react-query';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelDataFilter, LabelSimpleData } from '../types';

export const useGetListLabelsSimple = (
    params?: LabelDataFilter,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: labelsQueryKeys.listSimple(params),
        queryFn: () => labelsApi.getListSimple(params),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const labelsData = data?.data?.data ?? ([] as LabelSimpleData[]);

    return {
        labelsData,
        ...res,
    };
};
