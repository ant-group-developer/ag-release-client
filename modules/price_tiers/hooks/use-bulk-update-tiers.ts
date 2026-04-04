import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { UpdatePriceTiersOrderPayload } from '../types/payload';

export const useBulkUpdatePriceTiers = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdatePriceTiersOrderPayload
    ) => {
        queryClient.invalidateQueries({
            queryKey: priceTiersQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (error: any, { onError }: UpdatePriceTiersOrderPayload) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationKey: priceTiersQueryKeys.updates(),
        mutationFn: (payload: UpdatePriceTiersOrderPayload) =>
            priceTiersApis.bulkUpdatePriceTiers(payload),
        onSuccess,
        onError,
    });

    const updatePriceTiersOrder = (variables: UpdatePriceTiersOrderPayload) => {
        mutation.mutate(variables);
    };

    return {
        updatePriceTiersOrder,
        ...mutation,
    };
};
