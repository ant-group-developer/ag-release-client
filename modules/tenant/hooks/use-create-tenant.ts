import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { CreateTenant } from '../types/data';

export function useCreateTenant() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const handleOnSuccess = (data: any, { onSuccess }: CreateTenant) => {
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.active() });
        showNotification('success', messages('message.createSuccessfully'));
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: CreateTenant) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateTenant) => tenantApi.create(payload),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const createTenant = (variables: CreateTenant) => {
        mutation.mutate(variables);
    };

    return { ...mutation, createTenant };
}
