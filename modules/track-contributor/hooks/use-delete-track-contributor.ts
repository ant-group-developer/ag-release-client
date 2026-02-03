import { useApiNotify } from '@/hooks/use-api-notify';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackContributorApi } from '../apis';
import { TrackContributorData } from '../types';

export const useDeleteTrackContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess, trackId }: any) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list(),
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
        { onError }: DeleteVariables<TrackContributorData['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackContributorData['id']>) =>
            trackContributorApi.delete(id),
        onSuccess,
        onError,
    });

    const deleteTrackContributor = (
        variables: DeleteVariables<TrackContributorData['id']>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        deleteTrackContributor,
        ...mutation,
    };
};
