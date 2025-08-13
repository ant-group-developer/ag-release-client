import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { acrCloudApis } from '../apis';
import { acrCloudQueryKeys } from '../constants/query-keys';

export const useReScan = () => {
    const { handleError } = useApiError();
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: DeleteVariables<string>) => {
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
        queryClient.invalidateQueries({
            queryKey: acrCloudQueryKeys.getScanStatusLists(),
        });
    };

    const onError = (error: any, { onError }: DeleteVariables<string>) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<string>) =>
            acrCloudApis.reScan(id),
        onSuccess,
        onError,
    });

    const reScan = (variables: DeleteVariables<string>) => {
        mutation.mutate(variables);
    };

    return {
        reScan,
        ...mutation,
    };
};
