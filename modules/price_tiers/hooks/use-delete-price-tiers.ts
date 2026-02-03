import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { PriceTiersData } from '../types';

export const useDeletePriceTiers = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<PriceTiersData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: priceTiersQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: DeleteVariables<PriceTiersData['id']>
    ) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<PriceTiersData['id']>) =>
            priceTiersApis.deletePriceTiers(id),
        onSuccess,
        onError,
    });

    const deletePriceTiers = (
        variables: DeleteVariables<PriceTiersData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deletePriceTiers,
        ...mutation,
    };
};
