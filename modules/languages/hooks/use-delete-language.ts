import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguagesData } from '../types';

export const useDeleteLanguage = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<LanguagesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...languageQueryKeys.getList],
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<LanguagesData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        showNotification(
            'error',
            responseMessages ?? messages('common.somethingWentWrong')
        );
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<LanguagesData['id']>) =>
            languageApi.deleteLanguage(id),
        onSuccess,
        onError,
    });

    const deleteLanguage = (
        variables: DeleteVariables<LanguagesData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteLanguage,
        ...mutation,
    };
};
