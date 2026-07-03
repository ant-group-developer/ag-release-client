import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';
import { DspDetailParams, ReleaseOverviewData } from '../types';

export const useGetDspOverview = (
    params: DspDetailParams,
    enabled: boolean = true
) => {
    const { data, ...res } = useQuery({
        queryKey: analytics2QueryKeys.dspOverview(params),
        queryFn: () => analytics2Apis.getDspOverview({ ...params }),
        placeholderData: (prev) => prev,
        enabled: enabled && !!params.pgDspId && !!params.dspReportId,
    });

    return {
        overviewData: data?.data?.data ?? ({} as ReleaseOverviewData),
        ...res,
    };
};
