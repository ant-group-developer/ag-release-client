import { useQuery } from '@tanstack/react-query';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';

export const useGetReleaseCiDataDetailByReleaseId = (
    releaseId: string,
    options?: {
        enabled?: boolean;
    }
) => {
    const { data, ...res } = useQuery({
        queryKey: releaseDistributionQueryKeys.detailByReleaseId(releaseId),
        queryFn: () => releaseDistributionApi.getReleaseCiDataDetailByReleaseId(releaseId),
        enabled: (options?.enabled ?? true) && !!releaseId,
    });
    const releaseCiDataDetail = data?.data?.data;

    return {
        releaseCiDataDetail,
        ...res,
    };
};
