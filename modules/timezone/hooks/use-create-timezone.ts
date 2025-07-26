import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { timezoneApi } from '../apis';
import { timezoneQueryKeys } from '../constants/query-keys';
import { CreateTimezonePayload } from '../types/payload';

export const useCreateTimezone = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTimezonePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...timezoneQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTimezonePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
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
