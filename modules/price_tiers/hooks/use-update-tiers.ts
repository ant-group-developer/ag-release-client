import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { PriceTiersData } from '../types';
import { UpdatePriceTiersPayload } from '../types/payload';

export const useUpdatePriceTiers = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();
    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<PriceTiersData['id'], UpdatePriceTiersPayload>
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
        {
            onError,
        }: UpdateVariables<PriceTiersData['id'], UpdatePriceTiersPayload>
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationKey: priceTiersQueryKeys.updates(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<PriceTiersData['id'], UpdatePriceTiersPayload>) =>
            priceTiersApis.updatePriceTiers(id, payload),
        onSuccess,
        onError,
    });

    const updatePriceTiers = (
        variables: UpdateVariables<
            PriceTiersData['id'],
            UpdatePriceTiersPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updatePriceTiers,
        ...mutation,
    };
};
