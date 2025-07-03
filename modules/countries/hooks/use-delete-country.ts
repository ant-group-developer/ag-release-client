import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData } from '../types';

export const useDeleteCountry = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<CountriesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...countriesQueryKeys.getList],
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<CountriesData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
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
