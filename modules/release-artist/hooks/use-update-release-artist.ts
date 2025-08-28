import { useApiError } from '@/hooks/use-api-error';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseArtistApi } from '../apis';
import { releaseArtistQueryKeys } from '../constants/query-keys';
import { ReleaseArtist } from '../types';
import { UpdateReleaseArtistPayload } from '../types/payload';

export const useUpdateReleaseArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateReleaseArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseArtistQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<UpdateReleaseArtistPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleaseArtist['id'], UpdateReleaseArtistPayload>) =>
            releaseArtistApi.updateReleaseArtist(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseArtist = (
        variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateReleaseArtist,
        ...mutation,
    };
};
