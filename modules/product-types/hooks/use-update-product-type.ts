import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';
import { ProductTypeData } from '../types';

export interface UpdateProductTypePayload
    extends Omit<ProductTypeData, 'id' | 'dateCreated' | 'dateUpdated'> {
    googleDriveIconId: string | undefined | null;
}

export interface UpdateProductType extends CommonFunction {
    id: ProductTypeData['id'];
    payload: UpdateProductTypePayload;
}

export const useUpdateProductType = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: UpdateProductType) => {
        queryClient.invalidateQueries({
            queryKey: productTypesQueryKeys.getList,
        });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: UpdateProductType) => {
        showNotification('error', messages(data?.response?.data?.message));
        variables.onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id, payload }: UpdateProductType) =>
            productTypesApis.updateProductType(id, payload),
        onSuccess,
        onError,
    });

    const updateProductType = (variables: UpdateProductType) => {
        mutation.mutate(variables);
    };

    return { updateProductType, ...mutation };
};
