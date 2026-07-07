import { useQuery } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import {
    ImportJobStatusResponse,
    RUNNING_IMPORT_JOB_STATUSES,
} from '../types/payload';

export const useGetImportJobStatus = (jobId: string, enabled = true) => {
    const query = useQuery({
        queryKey: ['importJobStatus', jobId],
        queryFn: () => reportConfigApis.getImportJobStatus(jobId),
        enabled: enabled && !!jobId,
        refetchInterval: (query) => {
            const status = query.state.data?.data?.data?.status;
            if (status && RUNNING_IMPORT_JOB_STATUSES.includes(status)) {
                return 5000; // poll every 5 seconds
            }
            return false;
        },
    });

    const jobStatus: ImportJobStatusResponse | undefined =
        query.data?.data?.data;

    return {
        jobStatus,
        ...query,
    };
};
