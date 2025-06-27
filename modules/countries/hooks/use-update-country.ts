import { showNotification } from '@/helpers/messages-helper';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CountriesData } from '../types';
import { UpdateCountryPayload } from '../types/payload';

export const useUpdateCountry = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<CountriesData['id'], UpdateCountryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [countriesQueryKeys.getList],
        });
        const responseMessages = messages(data?.data?.message);
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<CountriesData['id'], UpdateCountryPayload>
    ) => {
        const responseMessages = messages(data?.response.data.messages);
        showNotification('error', responseMessages);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<CountriesData['id'], UpdateCountryPayload>) =>
            countriesApi.updateCountry(id, payload),
        onSuccess,
        onError,
    });

    const updateCountry = (
        variables: UpdateVariables<CountriesData['id'], UpdateCountryPayload>
    ) => {
        mutation.mutate(variables);
    };

    return { updateCountry, ...mutation };
};
