import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { priceTiersApis } from '../apis';
import { priceTiersQueryKeys } from '../constants/query-keys';
import { CreatePriceTiersPayload } from '../types/payload';

export const useCreatePriceTiers = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreatePriceTiersPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: priceTiersQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreatePriceTiersPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreatePriceTiersPayload>) =>
            priceTiersApis.createPriceTiers(payload),
        onSuccess,
        onError,
    });

    const createPriceTiers = (
        variables: CreateVariables<CreatePriceTiersPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createPriceTiers,
        ...mutation,
    };
};
