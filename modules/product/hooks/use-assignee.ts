import { showNotification } from '@/helpers/messages-helper';
import { orderQueryKeys } from '@/modules/order/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { UserAssignPayload } from '../types';

export const useAssignUser = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UserAssignPayload) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: UserAssignPayload) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UserAssignPayload) =>
            productApi.assignUser(payload),
        onSuccess,
        onError,
    });

    const assignUser = (variables: UserAssignPayload) => {
        mutation.mutate(variables);
    };

    return {
        assignUser,
        ...mutation,
    };
};
