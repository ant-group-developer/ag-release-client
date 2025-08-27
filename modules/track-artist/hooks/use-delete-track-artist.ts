import { useApiError } from '@/hooks/use-api-error';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackArtistApi } from '../apis';
import { TrackArtistData } from '../types';

export const useDeleteTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackArtistData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });
        // queryClient.invalidateQueries({
        //     queryKey: [...releasesQueryKeys.getDetail],
        // });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackArtistData['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackArtistData['id']>) =>
            trackArtistApi.deleteTrackArtist(id),
        onSuccess,
        onError,
    });

    const deleteTrackArtist = (
        variables: DeleteVariables<TrackArtistData['id']>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        deleteTrackArtist,
        ...mutation,
    };
};
