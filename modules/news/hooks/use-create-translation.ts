import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { CreateTranslation } from '../types/payloads';

export const useCreateTranslation = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: CreateTranslation) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (error: any, { onError }: CreateTranslation) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ newsId, payload }: CreateTranslation) =>
            newsApis.createTranslate(newsId, payload),
        onSuccess,
        onError,
    });

    const createTranslation = (variables: CreateTranslation) => {
        mutation.mutate(variables);
    };

    return {
        createTranslation,
        ...mutation,
    };
};
