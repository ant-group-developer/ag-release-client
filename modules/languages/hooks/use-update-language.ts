import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { LanguagesData } from '../types';
import { UpdateLanguagePayload } from '../types/payload';

export const useUpdateLanguage = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<LanguagesData['id'], UpdateLanguagePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: languageQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<LanguagesData['id'], UpdateLanguagePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<LanguagesData['id'], UpdateLanguagePayload>) =>
            languageApi.updateLanguage(id, payload),
        onSuccess,
        onError,
    });

    const updateLanguage = (
        variable: UpdateVariables<LanguagesData['id'], UpdateLanguagePayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        updateLanguage,
        ...mutation,
    };
};
