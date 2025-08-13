import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackArtistApi } from '../apis';
import { TrackArtistData } from '../types';
import { UpdateTrackArtistPayload } from '../types/payload';

export const useUpdateTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateTrackArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
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
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
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
