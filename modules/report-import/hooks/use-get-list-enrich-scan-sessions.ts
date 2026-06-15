import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { CommonParams, PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { enrichScanSessionQueryKeys } from '../constants/query-keys';
import { EnrichScanSessionData } from '../types/payload';

export const useGetListEnrichScanSessions = (params: CommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: enrichScanSessionQueryKeys.list(params),
        queryFn: () => reportConfigApis.getListEnrichScanSessions(params),
        placeholderData: (prev) => prev,
        refetchOnWindowFocus: true,
    });

    const enrichScanSessionsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<EnrichScanSessionData>['data']);

    return {
        enrichScanSessionsData,
        ...res,
    };
};
