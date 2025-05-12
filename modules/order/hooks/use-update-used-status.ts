import { showNotification } from '@/helpers/messages-helper';
import { orderQueryKeys } from '@/modules/order/constants';
import { productQueryKeys } from '@/modules/product/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { orderApi } from '../apis';
import { UpdateUsedStatus } from '../types/update-order';

export const useUpdateUsedStatus = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UpdateUsedStatus) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: UpdateUsedStatus) => {
        showNotification('error', messages(data.data.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateUsedStatus) =>
            orderApi.updateUsedStatus(payload),
        onSuccess,
        onError,
    });

    const updateUsedStatus = (variables: UpdateUsedStatus) => {
        mutation.mutate(variables);
    };

    return {
        updateUsedStatus,
        ...mutation,
    };
};
