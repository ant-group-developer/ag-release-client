import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { AnalyticsCommonParams } from '../types';

export const useGetLabelTer = (
    labelId: string,
    params: AnalyticsCommonParams,
    options?: { enabled?: boolean }
) => {
    const query = useQuery({
        queryKey: analytics2QueryKeys.labelTer(labelId, params),
        queryFn: () => analytics2Apis.getLabelTer(labelId, params),
        placeholderData: (prev) => prev,
        ...options,
        enabled: (options?.enabled ?? true) && !!labelId,
    });

    const labelTerData = query.data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        labelTerData,
        ...query,
    };
};
