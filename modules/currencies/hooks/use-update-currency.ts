import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';
import { CurrenciesData } from '../types';
import { UpdateCurrenciesPayload } from '../types/payload';

export const useUpdateCurrency = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<CurrenciesData['id'], UpdateCurrenciesPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: currenciesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<CurrenciesData['id'], UpdateCurrenciesPayload>
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<CurrenciesData['id'], UpdateCurrenciesPayload>) =>
            currenciesApis.updateCurrency(id, payload),
        onSuccess,
        onError,
    });

    const updateCurrency = (
        variables: UpdateVariables<
            CurrenciesData['id'],
            UpdateCurrenciesPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateCurrency,
        ...mutation,
    };
};
