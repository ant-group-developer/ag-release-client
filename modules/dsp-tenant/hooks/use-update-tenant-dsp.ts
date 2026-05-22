import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantDspApi } from '../apis';
import { tenantDspQueryKeys } from '../constants/query-keys';
import { UpdateTenantDspPayload } from '../types/payload';

export const useUpdateTenantDsp = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<string, UpdateTenantDspPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantDspQueryKeys.lists(),
        });

        // Use the generic update success message, since messageCode might not be present
        const responseMessages = data?.data?.messageCode 
            ? messages(data.data.messageCode as any) 
            : messages('common.updateSuccess' as any); // fallback

        onSuccess?.(data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<string, UpdateTenantDspPayload>
    ) => {
        onError?.(data);
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<string, UpdateTenantDspPayload>) =>
            tenantDspApi.update(id, payload),
        onSuccess,
        onError,
    });

    const updateTenantDsp = (
        variables: UpdateVariables<string, UpdateTenantDspPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTenantDsp,
        isUpdating: mutation.isPending,
        ...mutation,
    };
};
