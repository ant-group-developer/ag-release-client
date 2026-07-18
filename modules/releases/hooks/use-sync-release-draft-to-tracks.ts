import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releasesApi } from '../apis';
import { releasesQueryKeys } from '../constants/query-keys';
import { SyncReleaseDraftToTracks } from '../types/payload';

export const useSyncReleaseDraftToTracks = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { id, onSuccess }: SyncReleaseDraftToTracks
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.detail(id),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });

        onSuccess?.(data?.data?.data);
        showNotification('success', messages('common.success'));
    };

    const onError = (error: any, { onError }: SyncReleaseDraftToTracks) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ id, payload }: SyncReleaseDraftToTracks) =>
            releasesApi.syncReleaseDraftToTracks(id, payload),
        onSuccess,
        onError,
    });

    const syncReleaseDraftToTracks = (variables: SyncReleaseDraftToTracks) => {
        return mutation.mutate(variables);
    };

    return {
        syncReleaseDraftToTracks,
        ...mutation,
    };
};
