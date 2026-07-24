import { useQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';

interface Options {
    /** Metrics là admin-only → chỉ bật khi user là admin. */
    enabled?: boolean;
    /** ms — auto refetch (mặc định tắt). */
    refetchInterval?: number;
}

/** GET /distributions/metrics — observability (admin). */
export const useGetMetrics = (options: Options = {}) => {
    const { enabled = false, refetchInterval } = options;

    const { data, ...rest } = useQuery({
        queryKey: distributionOrchestrationQueryKeys.metrics(),
        queryFn: () => distributionOrchestrationApis.getMetrics(),
        enabled,
        refetchInterval,
    });

    const metrics = data?.data?.data;

    return { metrics, ...rest };
};
