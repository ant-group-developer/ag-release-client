import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';
import { ActionsData } from '../types';
import { UpdateActionPayload } from '../types/payload';

export const useUpdateAction = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<ActionsData['id'], UpdateActionPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: actionsQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<ActionsData['id'], UpdateActionPayload>
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ActionsData['id'], UpdateActionPayload>) =>
            actionsApis.updateAction(id, payload),
        onSuccess,
        onError,
    });

    const updateAction = (
        variables: UpdateVariables<ActionsData['id'], UpdateActionPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateAction,
        ...mutation,
    };
};
