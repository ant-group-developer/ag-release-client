import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { TranslationData } from '../types';

export const useDeleteTranslation = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TranslationData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TranslationData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TranslationData['id']>) =>
            newsApis.deleteTranslation(id),
        onSuccess,
        onError,
    });

    const deleteTranslation = (
        variables: DeleteVariables<TranslationData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTranslation,
        ...mutation,
    };
};
