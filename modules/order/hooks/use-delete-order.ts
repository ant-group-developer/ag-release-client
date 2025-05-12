import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { DeleteOrder } from '../types/delete-order';

export const useDeleteOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: DeleteOrder) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });

        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: DeleteOrder) => {
        showNotification('error', messages(data?.response?.data?.message));
    };

    const mutation = useMutation({
        mutationFn: ({ orderId }: DeleteOrder) => orderApi.deleteOrder(orderId),
        onSuccess,
        onError,
    });

    const deleteOrder = (variables: DeleteOrder) => {
        mutation.mutate(variables);
    };

    return { deleteOrder, ...mutation };
};
