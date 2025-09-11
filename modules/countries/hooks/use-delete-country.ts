import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData } from '../types';

export const useDeleteCountry = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<CountriesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: countriesQueryKeys.lists(),
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<CountriesData['id']>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<CountriesData['id']>) =>
            countriesApi.deleteCountry(id),
        onSuccess,
        onError,
    });

    const deleteCountry = (variables: DeleteVariables<CountriesData['id']>) => {
        mutation.mutate(variables);
    };

    return { deleteCountry, ...mutation };
};
