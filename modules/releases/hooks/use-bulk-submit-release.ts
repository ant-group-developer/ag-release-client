import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { BulkSubmitRelease } from '../types/payload';

export const useBulkSubmitRelease = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<BulkSubmitRelease>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkSubmitRelease>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<BulkSubmitRelease>) =>
            releasesApi.bulkSubmit(payload),
        onSuccess,
        onError,
    });
    const bulkSubmitRelease = (
        variables: CreateVariables<BulkSubmitRelease>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        bulkSubmitRelease,
        ...mutation,
    };
};
