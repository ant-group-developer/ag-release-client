import { useQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';

/**
 * GET /distributions/by-release/:releaseId — distribution mới nhất của 1 release.
 * Dùng cho detail page thay vì gọi list rồi lấy phần tử đầu.
 */
export const useGetDistributionByRelease = (releaseId: string) => {
    const { data, ...rest } = useQuery({
        queryKey: distributionOrchestrationQueryKeys.byRelease(releaseId),
        queryFn: () => distributionOrchestrationApis.getByRelease(releaseId),
        enabled: !!releaseId,
    });

    const distributionInfo = data?.data?.data ?? null;

    return { distributionInfo, ...rest };
};
