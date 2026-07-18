import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { newsCategoryApis } from '../apis';
import { newsCategoryQueryKeys } from '../constants/query-keys';
import { CreateNewsCategoryPayload } from '../types/payloads';

export const useCreateNewsCategory = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateNewsCategoryPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: newsCategoryQueryKeys.all,
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateNewsCategoryPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateNewsCategoryPayload>) =>
            newsCategoryApis.create(payload),
        onSuccess,
        onError,
    });

    const createNewsCategory = (
        variables: CreateVariables<CreateNewsCategoryPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createNewsCategory,
        ...mutation,
    };
};
