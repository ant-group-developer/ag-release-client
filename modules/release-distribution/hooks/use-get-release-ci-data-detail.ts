import { useQuery } from '@tanstack/react-query';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';

export const useGetReleaseCiDataDetail = (
    id: string,
    options?: {
        enabled?: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseDistributionQueryKeys.detail(id),
        queryFn: () => releaseDistributionApi.getReleaseCiDataDetail(id),
        enabled: (options?.enabled ?? true) && !!id,
    });
    const releaseCiDataDetail = data?.data?.data;

    return {
        releaseCiDataDetail,
        ...res,
    };
};
