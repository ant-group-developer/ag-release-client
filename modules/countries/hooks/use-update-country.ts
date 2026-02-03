import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
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
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<CountriesData['id'], UpdateCountryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: countriesQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        showNotification('success', responseMessages);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<CountriesData['id'], UpdateCountryPayload>
    ) => {
        const responseMessages = messages(data?.response.data.messageCode);
        handleError(data);
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
