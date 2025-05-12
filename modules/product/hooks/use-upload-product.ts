import { showNotification } from '@/helpers/messages-helper';
import { orderQueryKeys } from '@/modules/order/constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { productApi } from '../apis';
import { productQueryKeys } from '../constants';
import { SubmitProductFilePayload } from '../types/update-product-file';

export const useUploadProduct = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const onSuccess = (data: any, { onSuccess }: SubmitProductFilePayload) => {
        queryClient.invalidateQueries({ queryKey: productQueryKeys.all });
        queryClient.invalidateQueries({ queryKey: orderQueryKeys.all });

        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: SubmitProductFilePayload) => {
        showNotification('error', messages(data?.response?.data?.message));
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ orderProductId, payload }: SubmitProductFilePayload) =>
            productApi.submitProductFile(orderProductId, payload),
        onSuccess,
        onError,
    });

    const uploadProduct = (payload: SubmitProductFilePayload) => {
        mutation.mutate(payload);
    };

    return { uploadProduct, ...mutation };
};
