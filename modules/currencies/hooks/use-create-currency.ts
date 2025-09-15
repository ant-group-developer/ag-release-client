import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';
import { CreateCurrenciesPayload } from '../types/payload';

export const useCreateCurrency = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateCurrenciesPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: currenciesQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateCurrenciesPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateCurrenciesPayload>) =>
            currenciesApis.createCurrency(payload),
        onSuccess,
        onError,
    });

    const createCurrency = (
        variables: CreateVariables<CreateCurrenciesPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createCurrency,
        ...mutation,
    };
};
