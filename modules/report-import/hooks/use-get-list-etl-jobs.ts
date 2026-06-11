import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { PaginationResponse, CommonParams } from '@/types/api';
import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { etlJobQueryKeys } from '../constants/query-keys';
import { EtlJobData } from '../types/payload';

export const useGetListEtlJobs = (params: CommonParams) => {
    const { data, ...res } = useQuery({
        queryKey: etlJobQueryKeys.list(params),
        queryFn: () => reportConfigApis.getListEtlJobs(params),
        placeholderData: (prev) => prev,
    });

    const etlJobsData =
        data?.data?.data ??
        (DEFAULT_DATA_PAGINATION as PaginationResponse<EtlJobData>['data']);

    return {
        etlJobsData,
        ...res,
    };
};
