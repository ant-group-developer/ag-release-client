import { showNotification } from '@/helpers/messages-helper';
import { orderQueryKeys } from '@/modules/order/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { RemoveAssignee } from '../types';

export const useRemoveAssignee = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: RemoveAssignee) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: RemoveAssignee) => {
        showNotification('error', messages(data.data.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: RemoveAssignee) =>
            productApi.removeAssignee(payload),
        onSuccess,
        onError,
        onMutate: async ({ payload }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: productQueryKeys.getList,
            });

            // Snapshot the previous value
            const previousProducts = queryClient.getQueryData(
                productQueryKeys.getList
            );

            // Optimistically update to the new value
            queryClient.setQueryData(productQueryKeys.getList, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    items: old.items.map((item: any) =>
                        payload.orderProductIds.includes(item.id)
                            ? { ...item, assigneeId: null }
                            : item
                    ),
                };
            });

            // Return a context object with the snapshotted value
            return { previousProducts };
        },
        onSettled: (data, error, variables, context) => {
            // Always refetch after error or success to ensure data consistency
            queryClient.invalidateQueries({
                queryKey: productQueryKeys.getList,
            });
        },
    });

    const removeAssignee = (variables: RemoveAssignee) => {
        mutation.mutate(variables);
    };

    return {
        removeAssignee,
        ...mutation,
    };
};
