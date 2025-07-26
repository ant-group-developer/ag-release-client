import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { TimezoneData } from '../types';

export const useDeleteTimezone = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TimezoneData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...timezoneQueryKeys.getList],
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TimezoneData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
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
