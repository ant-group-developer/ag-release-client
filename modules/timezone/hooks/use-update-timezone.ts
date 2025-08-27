import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { TimezoneData } from '../types';
import { UpdateTimezonePayload } from '../types/payload';

export const useUpdateTimezone = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<TimezoneData['id'], UpdateTimezonePayload>
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
        { onError }: UpdateVariables<TimezoneData['id'], UpdateTimezonePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TimezoneData['id'], UpdateTimezonePayload>) =>
            timezoneApi.updateTimezone(id, payload),
        onSuccess,
        onError,
    });

    const updateTimezone = (
        variable: UpdateVariables<TimezoneData['id'], UpdateTimezonePayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        updateTimezone,
        ...mutation,
    };
};
