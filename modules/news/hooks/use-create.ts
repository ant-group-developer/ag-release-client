import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { CreateNewsPayload } from '../types/payloads';

export const useCreateNews = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateNewsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateNewsPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateNewsPayload>) =>
            newsApis.create(payload),
        onSuccess,
        onError,
    });

    const createNews = (variables: CreateVariables<CreateNewsPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createNews,
        ...mutation,
    };
};
