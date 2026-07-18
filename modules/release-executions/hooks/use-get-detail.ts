import { useQuery } from '@tanstack/react-query';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';
import { ReleaseExecutionData } from '../types';

export const useGetDetailReleaseExecution = (id?: string | null) => {
    const { data, ...rest } = useQuery({
        queryKey: releaseExecutionQueryKeys.detail(id ?? ''),
        queryFn: () => releaseExecutionApis.getDetail(id ?? ''),
        enabled: !!id,
        placeholderData: (prevData) => prevData,
    });

    return {
        releaseExecutionDetail: data?.data?.data as
            | ReleaseExecutionData
            | undefined,
        ...rest,
    };
};
