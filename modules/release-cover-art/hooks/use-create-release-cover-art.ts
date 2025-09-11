import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseCoverArtApi } from '../apis';
import { ReleaseCoverArtPayload } from '../types';

export const useCreateReleaseCoverArt = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<ReleaseCoverArtPayload>
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
        { onError }: CreateVariables<ReleaseCoverArtPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<ReleaseCoverArtPayload>) =>
            releaseCoverArtApi.createReleaseCoverArt(payload),
        onSuccess,
        onError,
    });

    const createReleaseCoverArt = (
        variables: CreateVariables<ReleaseCoverArtPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        createReleaseCoverArt,
        ...mutation,
    };
};
