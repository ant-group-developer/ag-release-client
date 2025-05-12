import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { RestoreOrder } from '../types/update-order';

export const useRestoreOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: RestoreOrder) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
        showNotification(
            'success',
            messages(data?.data?.message) + ' ' + data?.data?.data?.code
        );
        onSuccess?.();
    };

    const onError = (data: any, { onError }: RestoreOrder) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.(data);
    };
    const mutation = useMutation({
        mutationFn: ({ orderId }: RestoreOrder) =>
            orderApi.restoreOrder(orderId),
        onSuccess,
        onError,
    });

    const restoreOrder = (variables: RestoreOrder) => {
        mutation.mutate(variables);
    };

    return { restoreOrder, ...mutation };
};
