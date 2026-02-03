import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { languageApi } from '../apis';
import { languageQueryKeys } from '../constants/query-keys';
import { CreateLanguagePayload } from '../types/payload';

export const useCreateLanguage = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateLanguagePayload>
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
        { onError }: CreateVariables<CreateLanguagePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateLanguagePayload>) =>
            languageApi.createLanguage(payload),
        onSuccess,
        onError,
    });

    const createLanguage = (
        variable: CreateVariables<CreateLanguagePayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        createLanguage,
        ...mutation,
    };
};
