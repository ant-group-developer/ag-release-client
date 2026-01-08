import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackArtistApi } from '@/modules/track-artist/apis';
import { TrackArtistData } from '@/modules/track-artist/types';
import { UpdateTrackArtistPayload } from '@/modules/track-artist/types/payload';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export const useUpdateTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateTrackArtistPayload>
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
        { onError }: CreateVariables<UpdateTrackArtistPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TrackArtistData['id'], UpdateTrackArtistPayload>) =>
            trackArtistApi.updateTrackArtist(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackArtist = (
        variables: UpdateVariables<
            TrackArtistData['id'],
            UpdateTrackArtistPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTrackArtist,
        ...mutation,
    };
};
