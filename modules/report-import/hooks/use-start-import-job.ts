import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { etlJobQueryKeys } from '../constants/query-keys';

interface StartImportJobVariables extends CommonFunction {
    jobId: string;
}

export const useStartImportJob = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ jobId }: StartImportJobVariables) =>
            reportConfigApis.startImportJob(jobId),
        onSuccess: (
            data,
            { onSuccess }: StartImportJobVariables
        ) => {
            queryClient.invalidateQueries({
                queryKey: etlJobQueryKeys.all,
            });
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (
            error,
            { onError }: StartImportJobVariables
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        startImportJob: mutation.mutate,
        ...mutation,
    };
};
export type { StartImportJobVariables };
