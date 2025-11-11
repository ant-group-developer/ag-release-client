import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { ReleasesData } from '../types';
import { UpdateReleaseDraftPayload } from '../types/payload';

export const useUpdateReleaseDraft = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.detail(data?.data?.data?.id),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        {
            onError,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>) =>
            releasesApi.updateReleaseDraft(id, payload),
        onSuccess,
        onError,
    });
    const updateReleaseDraft = (
        variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseDraftPayload
        >
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateReleaseDraft,
        ...mutation,
    };
};
