import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { countriesApi } from '../apis';
import { countriesQueryKeys } from '../constants/query-keys';
import { CreateCountryPayload } from '../types/payload';

export const useCreateCountry = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateCountryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: countriesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateCountryPayload>
    ) => {
        onError?.();
        handleError(data);
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
