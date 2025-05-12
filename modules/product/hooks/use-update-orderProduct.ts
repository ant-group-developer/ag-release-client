import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { UpdateOrderProduct } from '../types/update-orderProduct';

export const useUpdateOrderProduct = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UpdateOrderProduct) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.getList });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: UpdateOrderProduct) => {
        showNotification('error', messages(data.response.data.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ orderProductId, payload }: UpdateOrderProduct) =>
            productApi.update(orderProductId, payload),
        onSuccess,
        onError,
    });

    const updateOrderProduct = (variables: UpdateOrderProduct) => {
        mutation.mutate(variables);
    };

    return { updateOrderProduct, ...mutation };
};
