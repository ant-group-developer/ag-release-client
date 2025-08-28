import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { TrackData } from '../types';

export const useDeleteTrack = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackData['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackData['id']>) =>
            trackApi.deleteTrackDraft(id),
        onSuccess,
        onError,
    });

    const deleteTrack = (variables: DeleteVariables<TrackData['id']>) => {
        return mutation.mutate(variables);
    };

    return {
        deleteTrack,
        ...mutation,
    };
};
