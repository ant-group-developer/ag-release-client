import { useApiError } from '@/hooks/use-api-error';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseArtistApi } from '../apis';
import { releaseArtistQueryKeys } from '../constants/query-keys';
import { CreateReleaseArtistPayload } from '../types/payload';

export const useCreateReleaseArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateReleaseArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseArtistQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateReleaseArtistPayload>
    ) => {
        handleError(data);

        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateReleaseArtistPayload>) =>
            releaseArtistApi.createReleaseArtist(payload),
        onSuccess,
        onError,
    });

    const createReleaseArtist = (
        variables: CreateVariables<CreateReleaseArtistPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createReleaseArtist,
        ...mutation,
    };
};
