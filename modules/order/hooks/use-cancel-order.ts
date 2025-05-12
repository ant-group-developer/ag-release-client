import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { CancelOrder } from '../types/update-order';

export const useCancelOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: CancelOrder) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });

        showNotification(
            'success',
            messages(data?.data?.message) + ' ' + data?.data?.data?.code
        );
        onSuccess?.();
    };

    const onError = (data: any, { onError }: CancelOrder) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.(data);
    };
    const mutation = useMutation({
        mutationFn: ({ orderId }: CancelOrder) => orderApi.cancelOrder(orderId),
        onSuccess,
        onError,
    });

    const cancelOrder = (variables: CancelOrder) => {
        mutation.mutate(variables);
    };

    return { cancelOrder, ...mutation };
};
