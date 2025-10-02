import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsApis } from '../apis';
import { newsQueryKeys } from '../constants/query-keys';
import { TranslationData } from '../types';
import { UpdateTranslationPayload } from '../types/payloads';

export const useUpdateTranslation = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<TranslationData['id'], UpdateTranslationPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsQueryKeys.getListTranslation(
                data?.data?.data?.newsPostId
            ),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<TranslationData['id'], UpdateTranslationPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TranslationData['id'], UpdateTranslationPayload>) =>
            newsApis.updateTranslation(id, payload),
        onSuccess,
        onError,
    });

    const updateTranslation = (
        variables: UpdateVariables<
            TranslationData['id'],
            UpdateTranslationPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTranslation,
        ...mutation,
    };
};
