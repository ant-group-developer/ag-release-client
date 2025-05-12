import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';

export interface UpdateProductTypeOrderPayload {
    data: Array<{ id: string; order: number }>;
}

export interface UpdateProductTypeOrder extends CommonFunction {
    payload: UpdateProductTypeOrderPayload;
}

export const useUpdateProductTypeOrder = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: UpdateProductTypeOrder) => {
        queryClient.invalidateQueries({
            queryKey: productTypesQueryKeys.getList,
        });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: UpdateProductTypeOrder) => {
        showNotification('error', messages(data?.response?.data?.message));
        variables.onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateProductTypeOrder) =>
            productTypesApis.updateProductTypeOrder(payload),
        onSuccess,
        onError,
    });

    const updateProductTypeOrder = (variables: UpdateProductTypeOrder) => {
        mutation.mutate(variables);
    };

    return { updateProductTypeOrder, ...mutation };
};
