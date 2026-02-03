import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { TimezoneData } from '../types';

export const useDeleteTimezone = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TimezoneData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: timezoneQueryKeys.lists(),
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TimezoneData['id']>
    ) => {
        handleError(data);

        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TimezoneData['id']>) =>
            timezoneApi.deleteTimezone(id),
        onSuccess,
        onError,
    });

    const deleteTimezone = (variables: DeleteVariables<TimezoneData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteTimezone,
        ...mutation,
    };
};
