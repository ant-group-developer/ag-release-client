import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { currenciesApis } from '../apis';
import { currenciesQueryKeys } from '../constants/query-keys';
import { CurrenciesData } from '../types';

export const useDeleteCurrency = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<CurrenciesData['id']>
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
        { onError }: DeleteVariables<CurrenciesData['id']>
    ) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<CurrenciesData['id']>) =>
            currenciesApis.deleteCurrency(id),
        onSuccess,
        onError,
    });

    const deleteCurrency = (
        variables: DeleteVariables<CurrenciesData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteCurrency,
        ...mutation,
    };
};
