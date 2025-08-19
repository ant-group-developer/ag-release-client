import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';
import { CreateActionPayload } from '../types/payload';

export const useCreateAction = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateActionPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: actionsQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateActionPayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateActionPayload>) =>
            actionsApis.createAction(payload),
        onSuccess,
        onError,
    });

    const createAction = (variables: CreateVariables<CreateActionPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createAction,
        ...mutation,
    };
};
