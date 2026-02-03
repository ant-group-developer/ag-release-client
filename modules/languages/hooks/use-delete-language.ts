import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguagesData } from '../types';

export const useDeleteLanguage = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<LanguagesData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: languageQueryKeys.lists(),
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<LanguagesData['id']>
    ) => {
        handleError(data);

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
