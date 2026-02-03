import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { LabelData } from '../types';
import { UpdateLabelPayload } from '../types/payload';

export const useUpdateLabel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<LabelData['id'], UpdateLabelPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: labelsQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<LabelData['id'], UpdateLabelPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<LabelData['id'], UpdateLabelPayload>) =>
            labelsApi.updateLabel(id, payload),
        onSuccess,
        onError,
    });

    const updateLabel = (
        variables: UpdateVariables<LabelData['id'], UpdateLabelPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateLabel,
        ...mutation,
    };
};
