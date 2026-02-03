import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { actionsApis } from '../apis';
import { actionsQueryKeys } from '../constants/query-keys';
import { ActionsData } from '../types';

export const useDeleteAction = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ActionsData['id']>
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
        { onError }: DeleteVariables<ActionsData['id']>
    ) => {
        handleError(error);
        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ActionsData['id']>) =>
            actionsApis.deleteAction(id),
        onSuccess,
        onError,
    });

    const deleteAction = (variables: DeleteVariables<ActionsData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteAction,
        ...mutation,
    };
};
