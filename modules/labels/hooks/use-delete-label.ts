import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelData } from '../types';

export const useDeleteLabel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<LabelData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...labelsQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<LabelData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<LabelData['id']>) =>
            labelsApi.deleteLabel(id),
        onSuccess,
        onError,
    });

    const deleteLabel = (variables: DeleteVariables<LabelData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteLabel,
        ...mutation,
    };
};
