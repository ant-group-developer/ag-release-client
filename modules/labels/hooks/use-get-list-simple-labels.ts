import { useQuery } from '@tanstack/react-query';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelSimpleData } from '../types';

export const useGetListLabelsSimple = (options?: { enabled: boolean }) => {
    const { data, ...res } = useQuery({
        queryKey: labelsQueryKeys.listsSimple(),
        queryFn: () => labelsApi.getListSimple(),
        placeholderData: (prev) => prev,
        enabled: options?.enabled ?? true,
    });

    const labelsData = data?.data?.data ?? ([] as LabelSimpleData[]);

    return {
        labelsData,
        ...res,
    };
};
