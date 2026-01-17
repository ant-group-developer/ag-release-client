import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackContributorApi } from '../apis';
import { TrackContributorData } from '../types';
import { UpdateTrackContributorPayload } from '../types/payload';

export const useUpdateTrackContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateTrackContributorPayload>
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
        { onError }: CreateVariables<UpdateTrackContributorPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            TrackContributorData['id'],
            UpdateTrackContributorPayload
        >) => trackContributorApi.update(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackContributor = (
        variables: UpdateVariables<
            TrackContributorData['id'],
            UpdateTrackContributorPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTrackContributor,
        ...mutation,
    };
};
