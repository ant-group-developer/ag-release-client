import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { NewsData } from '../types';

export const useDeleteNews = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<NewsData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<NewsData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<NewsData['id']>) =>
            newsApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteNews = (variables: DeleteVariables<NewsData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteNews,
        ...mutation,
    };
};
