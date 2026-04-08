import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';

export const useRetryReleaseExecution = () => {
    const { handleError } = useApiNotify();
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const mutation = useMutation({
        mutationKey: releaseExecutionQueryKeys.retry(),
        mutationFn: ({ id }: DeleteVariables<string>) =>
            releaseExecutionApis.retry(id),
        onSuccess: (_data, { onSuccess }) => {
            showNotification(
                'success',
                messages('releaseExecution.message.retrySuccess')
            );
            onSuccess?.();
            queryClient.invalidateQueries({
                queryKey: releaseExecutionQueryKeys.getList(),
            });
        },
        onError: (error, { onError }) => {
            handleError(error);
            onError?.(error);
        },
    });

    const retryReleaseExecution = (variables: DeleteVariables<string>) => {
        mutation.mutate(variables);
    };

    return {
        retryReleaseExecution,
        ...mutation,
    };
};
