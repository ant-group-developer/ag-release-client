import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetLabelOverview = (
    labelId: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.labelOverview(labelId, params),
        queryFn: () => analytics2Apis.getLabelOverview(labelId, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!labelId,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
