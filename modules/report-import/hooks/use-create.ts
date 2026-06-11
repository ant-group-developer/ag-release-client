import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { reportConfigQueryKeys } from '../constants/query-keys';
import { CreateReportConfigPayload } from '../types/payload';

export const useCreateReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateReportConfigPayload>) =>
            reportConfigApis.create(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<CreateReportConfigPayload>
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<CreateReportConfigPayload>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        createReportConfig: mutation.mutate,
        ...mutation,
    };
};
