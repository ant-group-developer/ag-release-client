import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { DeleteTracksPayload } from '../types/payload';

export const useBulkDeleteTracks = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: DeleteTracksPayload) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.listsTracksPolicies(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        onSuccess?.();
        handleSuccess(data?.data?.messageCode);
    };

    const onError = (data: any, { onError }: DeleteTracksPayload) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ ids }: DeleteTracksPayload) =>
            trackApi.bulkDeleteTrackDraft(ids),
        onSuccess,
        onError,
    });

    const deleteTracks = (variables: DeleteTracksPayload) => {
        return mutation.mutate(variables);
    };

    return {
        deleteTracks,
        ...mutation,
    };
};
