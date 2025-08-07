import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { UpdateTenant } from '../types/data';

export const useUpdateTenant = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess, tenantId }: UpdateTenant) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.detail(tenantId),
        });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateTenant) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload, tenantId }: UpdateTenant) =>
            tenantApi.update(tenantId, payload),
        onSuccess,
        onError,
    });

    const updateTenant = (variables: UpdateTenant) => {
        mutation.mutate(variables);
    };

    return { updateTenant, ...mutation };
};
