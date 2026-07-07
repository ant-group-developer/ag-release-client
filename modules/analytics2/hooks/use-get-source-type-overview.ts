import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { ReleaseOverviewData, ReleaseOverviewParams } from '../types';

export const useGetSourceTypeOverview = (
    sourceType: string,
    params: ReleaseOverviewParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.sourceTypeOverview(sourceType, params),
        queryFn: () => analytics2Apis.getSourceTypeOverview(sourceType, params),
        placeholderData: (prev) => prev,
        enabled: enabled && !!sourceType,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
