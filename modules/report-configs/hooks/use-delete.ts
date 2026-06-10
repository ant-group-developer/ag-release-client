import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { reportConfigQueryKeys } from '../constants/query-keys';
import { ReportConfigData } from '../types';

export const useDeleteReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReportConfigData['id']>) =>
            reportConfigApis.delete(id),
        onSuccess: (
            data,
            { onSuccess }: DeleteVariables<ReportConfigData['id']>
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: DeleteVariables<ReportConfigData['id']>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteReportConfig: mutation.mutate,
        ...mutation,
    };
};
