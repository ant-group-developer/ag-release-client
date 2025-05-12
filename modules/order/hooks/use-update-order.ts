import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { UpdateOrder } from '../types/update-order';

export const useUpdateOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: UpdateOrder) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
        showNotification('success', messages(data?.data?.message));
        onSuccess?.();
    };

    const onError = (data: any, { onSuccess, onError }: UpdateOrder) => {
        showNotification('error', messages(data?.response?.data.message));
        onError?.(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateOrder) => orderApi.updateOrder(payload),
        onError,
        onSuccess,
    });

    const updateOrder = (variables: UpdateOrder) => {
        mutation.mutate(variables);
    };

    return { updateOrder, ...mutation };
};
