import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';
import { CommonFunction } from '@/types/api';

export function useCreateMissingReleaseCiData() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const handleOnSuccess = (data: any, { onSuccess }: CommonFunction = {}) => {
        queryClient.invalidateQueries({
            queryKey: releaseDistributionQueryKeys.lists(),
        });
        showNotification('success', messages('message.createSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: CommonFunction = {}) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: () => releaseDistributionApi.createMissingReleaseCiData(),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const createMissingReleaseCiData = (variables?: CommonFunction) => {
        mutation.mutate(variables);
    };

    return { ...mutation, createMissingReleaseCiData };
}
