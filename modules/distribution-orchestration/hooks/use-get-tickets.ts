import { useQuery } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';

interface Options {
    enabled?: boolean;
}

/** GET /distributions/:id/tickets — flag lỗi (reviewer + CI/QA/Spotify). */
export const useGetTickets = (id?: string, options: Options = {}) => {
    const { enabled = true } = options;

    const { data, ...rest } = useQuery({
        queryKey: distributionOrchestrationQueryKeys.tickets(id ?? ''),
        queryFn: () => distributionOrchestrationApis.getTickets(id as string),
        enabled: enabled && !!id,
    });

    const tickets = data?.data?.data ?? [];

    return { tickets, ...rest };
};
