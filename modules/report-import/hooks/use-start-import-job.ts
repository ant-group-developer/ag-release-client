import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { CommonFunction } from '@/types/api';

interface StartImportJobVariables extends CommonFunction {
    jobId: string;
}

export const useStartImportJob = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ jobId }: StartImportJobVariables) =>
            reportConfigApis.startImportJob(jobId),
        onSuccess: (
            data,
            { onSuccess }: StartImportJobVariables
        ) => {
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
