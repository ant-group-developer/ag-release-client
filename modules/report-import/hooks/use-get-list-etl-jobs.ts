import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { CommonParams, PaginationResponse } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { etlJobQueryKeys } from '../constants/query-keys';
import { EtlJobData, ImportJobStatus } from '../types/payload';

export const useGetListEtlJobs = (params: CommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: etlJobQueryKeys.list(params),
        queryFn: () => reportConfigApis.getListEtlJobs(params),
        placeholderData: (prev) => prev,
        refetchInterval: (query) => {
            const items = query.state.data?.data?.data?.items ?? [];
            const hasRunningJob = items.some(
                (item) =>
                    item.status === ImportJobStatus.PENDING ||
                    item.status === ImportJobStatus.PROCESSING
            );

            return hasRunningJob ? 5000 : false;
        },
        refetchOnWindowFocus: true,
    });

    const etlJobsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<EtlJobData>['data']);

    return {
        etlJobsData,
        ...res,
    };
};
