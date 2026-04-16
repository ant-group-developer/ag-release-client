import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import { UpdateTenantRoles } from '../types/data';

export const useUpdateTenantRoles = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, payload: { tenantId } }: UpdateTenantRoles
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.tenantRoles(tenantId),
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateTenantRoles) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateTenantRoles) =>
            tenantApi.updateRoles(payload),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const updateTenantRoles = (variables: UpdateTenantRoles) => {
        mutation.mutate(variables);
    };

    return { updateTenantRoles, ...mutation };
};
