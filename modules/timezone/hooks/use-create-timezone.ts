import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { CreateTimezonePayload } from '../types/payload';

export const useCreateTimezone = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTimezonePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: timezoneQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTimezonePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTimezonePayload>) =>
            timezoneApi.createTimezone(payload),
        onSuccess,
        onError,
    });

    const createTimezone = (
        variable: CreateVariables<CreateTimezonePayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        createTimezone,
        ...mutation,
    };
};
