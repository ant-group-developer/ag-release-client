import { useQuery } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { analytics2QueryKeys } from '../constants/query-keys';

type Params = {
    jobId?: string;
    enabled?: boolean;
};

export const useGetSyncJob = ({ jobId, enabled }: Params) => {
    return useQuery({
        queryKey: analytics2QueryKeys.syncJob(jobId),
        queryFn: () => analytics2Apis.getSyncJob(jobId as string),
        enabled: !!jobId && enabled,
        refetchInterval: (query) =>
            query.state.status === 'error' ? false : 3000,
        retry: 3,
    });
};
