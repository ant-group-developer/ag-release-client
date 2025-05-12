import { showNotification } from '@/helpers/messages-helper';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { orderQueryKeys } from '../constants';
import { CreateOrder } from '../types/create-order';

export const useCreateOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (data: any, { onSuccess }: CreateOrder) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });

        onSuccess?.();
        const messageData = messages(data?.data?.message);
        const messageCode = `${messages('common.code')} ${data?.data?.data?.[0].code}`;
        const messageCodeCondition =
            data?.data?.data?.length === 1
                ? messageCode
                : // : `${messages('order.orderQuantity')} ${data?.data?.data?.length}`;
                  `${messages('common.from')} ${data?.data?.data?.[0].code} ${messages('common.to')} ${data?.data?.data?.[data?.data?.data?.length - 1].code}`;

        showNotification('success', `${messageData}: ${messageCodeCondition}`);
    };

    const onError = (data: any, { onSuccess, onError }: CreateOrder) => {
        showNotification('error', messages(data?.response?.data?.message));
        const errors = data.response.data.errors;
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateOrder) => orderApi.createOrder(payload),
        onSuccess,
        onError,
    });

    const createOrder = (variables: CreateOrder) => {
        mutation.mutate(variables);
    };

    return { createOrder, ...mutation };
};
