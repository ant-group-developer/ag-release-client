import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';
import { ProductTypeData } from '../types';

export interface CreateProductTypePayload
    extends Omit<
        ProductTypeData,
        'id' | 'dateCreated' | 'dateUpdated' | 'productCount' | 'order'
    > {
    googleDriveIconId: string | null;
}

export interface CreateProductType extends CommonFunction {
    payload: CreateProductTypePayload;
}

export const useCreateProductType = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: CreateProductType) => {
        queryClient.invalidateQueries({
            queryKey: productTypesQueryKeys.all,
        });
        showNotification('success', messages(data.data.message));
        variables.onSuccess?.();
    };

    const onError = (data: any, variables: CreateProductType) => {
        showNotification('error', messages(data?.response?.data?.message));
        variables.onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateProductType) =>
            productTypesApis.createProductType(payload),
        onSuccess,
        onError,
    });

    const createProductType = (variables: CreateProductType) => {
        mutation.mutate(variables);
    };

    return { createProductType, ...mutation };
};
