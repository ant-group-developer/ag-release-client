import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-key';
import { CreateCountryPayload } from '../types/payload';

export const useCreateCountry = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateCountryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [countriesQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.message);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateCountryPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.message);

        onError?.();
        showNotification('error', responseMessages);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateCountryPayload>) =>
            countriesApi.createCountry(payload),
        onSuccess,
        onError,
    });

    const createCountry = (
        variables: CreateVariables<CreateCountryPayload>
    ) => {
        mutation.mutate(variables);
    };

    return { createCountry, ...mutation };
};
