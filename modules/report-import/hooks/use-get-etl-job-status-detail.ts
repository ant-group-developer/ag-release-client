import { DetailResponse } from '@/types/api';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { reportConfigApis } from '../apis';
import { etlJobQueryKeys } from '../constants/query-keys';
import { EtlJobStatusDetailData } from '../types/payload';

export const useGetEtlJobStatusDetail = (
    id: string,
    options?: Omit<
        UseQueryOptions<
            AxiosResponse<DetailResponse<EtlJobStatusDetailData>>,
            Error,
            AxiosResponse<DetailResponse<EtlJobStatusDetailData>>,
            ReturnType<typeof etlJobQueryKeys.statusDetail>
        >,
        'queryKey' | 'queryFn'
    >
) => {
    const query = useQuery({
        queryKey: etlJobQueryKeys.statusDetail(id),
        queryFn: () => reportConfigApis.getEtlJobStatusDetail(id),
        enabled: !!id,
        ...options,
    });

    const statusDetail = query.data?.data?.data;

    return {
        statusDetail,
        ...query,
    };
};
