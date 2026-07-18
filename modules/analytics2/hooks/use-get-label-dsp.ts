import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetLabelDsp = (
    labelId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.labelDsp(labelId, params),
        queryFn: () => analytics2Apis.getLabelDsp(labelId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!labelId,
    });

    const labelDspData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        labelDspData,
        ...query,
    };
};
