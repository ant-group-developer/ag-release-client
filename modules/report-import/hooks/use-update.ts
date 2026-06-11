import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { reportConfigQueryKeys } from '../constants/query-keys';
import { ReportConfigData } from '../types';
import { UpdateReportConfigPayload } from '../types/payload';

export const useUpdateReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationKey: reportConfigQueryKeys.update(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            ReportConfigData['id'],
            UpdateReportConfigPayload
        >) => reportConfigApis.update(id, payload),
        onSuccess: (
            data,
            {
                id,
                onSuccess,
            }: UpdateVariables<
                ReportConfigData['id'],
                UpdateReportConfigPayload
            >
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.detail(id),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: UpdateVariables<
                ReportConfigData['id'],
                UpdateReportConfigPayload
            >
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateReportConfig: mutation.mutate,
        ...mutation,
    };
};
