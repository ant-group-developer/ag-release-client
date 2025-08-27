import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { CreateReleaseDraftPayload } from '../types/payload';

export const useCreateReleaseDraft = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateReleaseDraftPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateReleaseDraftPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateReleaseDraftPayload>) =>
            releasesApi.createReleaseDraft(payload),
        onSuccess,
        onError,
    });
    const createReleaseDraft = (
        variables: CreateVariables<CreateReleaseDraftPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        createReleaseDraft,
        ...mutation,
    };
};
