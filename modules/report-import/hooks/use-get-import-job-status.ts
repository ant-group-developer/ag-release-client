import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { ImportJobStatus } from '../types/payload';

export const useGetImportJobStatus = (jobId?: string, enabled = false) => {
    const query = useQuery({
        queryKey: ['importJobStatus', jobId],
        queryFn: () => {
            if (!jobId) throw new Error('Job ID is required');
            return reportConfigApis.getImportJobStatus(jobId);
        },
        enabled: enabled && !!jobId,
        refetchInterval: (query) => {
            const status = query.state.data?.data?.data?.status;
            if (
                status === ImportJobStatus.PENDING ||
                status === ImportJobStatus.PROCESSING
            ) {
                return 5000; // poll every 5 seconds
            }
            return false;
        },
    });

    return {
        jobStatus: query.data?.data?.data,
        ...query,
    };
};
