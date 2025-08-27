import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { labelsApi } from '../apis';
import { labelsQueryKeys } from '../constants/query-keys';
import { CreateLabelPayload } from '../types/payload';

export const useCreateLabel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateLabelPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: labelsQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateLabelPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateLabelPayload>) =>
            labelsApi.createLabel(payload),
        onSuccess,
        onError,
    });

    const createLabel = (variables: CreateVariables<CreateLabelPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createLabel,
        ...mutation,
    };
};
