import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackArtistApi } from '../apis';
import { CreateTrackArtistPayload } from '../types/payload';

export const useCreateTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list({
                pageSize: 999,
            }),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(data?.data?.data?.trackId),
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
        { onError }: CreateVariables<CreateTrackArtistPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTrackArtistPayload>) =>
            trackArtistApi.createTrackArtist(payload),
        onSuccess,
        onError,
    });

    const createTrackArtist = (
        variables: CreateVariables<CreateTrackArtistPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackArtist,
        ...mutation,
    };
};
