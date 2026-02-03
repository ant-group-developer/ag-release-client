import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';
import { UpdateNewsPayload } from '../types/payloads';

export const useUpdateNews = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<NewsData['id'], UpdateNewsPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<NewsData['id'], UpdateNewsPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<NewsData['id'], UpdateNewsPayload>) =>
            newsApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateNews = (
        variables: UpdateVariables<NewsData['id'], UpdateNewsPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateNews,
        ...mutation,
    };
};
