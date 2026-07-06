import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { BulkSubmitRelease } from '../types/payload';

export const usePreviewBulkSubmitResult = () => {
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<BulkSubmitRelease>) =>
            releasesApi.previewBulkSubmitResult(payload),
        onSuccess: (
            data: any,
            { onSuccess }: CreateVariables<BulkSubmitRelease>
        ) => {
            onSuccess?.(data?.data?.data);
        },
        onError: (
            data: any,
            { onError }: CreateVariables<BulkSubmitRelease>
        ) => {
            onError?.();
            handleError(data);
        },
    });

    const previewBulkSubmitResult = (
        variables: CreateVariables<BulkSubmitRelease>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        previewBulkSubmitResult,
        ...mutation,
    };
};
