import { useQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';

interface Options {
    enabled?: boolean;
    /** ms — auto refetch trạng thái channel (mặc định tắt). */
    refetchInterval?: number;
}

/** GET /distributions/:id/channels — trạng thái phát hành từng DSP. */
export const useGetChannels = (id?: string, options: Options = {}) => {
    const { enabled = true, refetchInterval } = options;

    const { data, ...rest } = useQuery({
        queryKey: distributionOrchestrationQueryKeys.channels(id ?? ''),
        queryFn: () => distributionOrchestrationApis.getChannels(id as string),
        enabled: enabled && !!id,
        refetchInterval,
    });

    const channels = data?.data?.data ?? [];

    return { channels, ...rest };
};
