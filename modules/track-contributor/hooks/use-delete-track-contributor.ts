import { useApiNotify } from '@/hooks/use-api-notify';
import { trackArtistApi } from '@/modules/track-artist/apis';
import { TrackArtistData } from '@/modules/track-artist/types';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

export const useDeleteTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess, trackId }: any) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list({
                pageSize: 999,
            }),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(trackId),
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
