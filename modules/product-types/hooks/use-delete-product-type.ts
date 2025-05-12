import { showNotification } from '@/helpers/messages-helper';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productTypesApis } from '../apis';
import { productTypesQueryKeys } from '../constants';

export interface DeleteProductType extends CommonFunction {
    productTypeId: string;
}

export const useDeleteProductType = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, variables: DeleteProductType) => {
        queryClient.invalidateQueries({
            queryKey: productTypesQueryKeys.all,
        });
        variables.onSuccess?.();
        showNotification('success', messages(data.data.message));
    };

    const onError = (data: any, variables: DeleteProductType) => {
        variables.onError?.();
        showNotification('error', messages(data?.response?.data?.message));
    };

    const { mutate: deleteProductType, ...rest } = useMutation({
        mutationFn: ({ productTypeId }: DeleteProductType) =>
            productTypesApis.deleteProductType(productTypeId),
        onSuccess,
        onError,
    });

    return {
        deleteProductType,
        ...rest,
    };
};
