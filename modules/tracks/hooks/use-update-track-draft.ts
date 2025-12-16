import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackData } from '../types';
import { UpdateTrackPayload } from '../types/payload';

export const useUpdateTrackDraft = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(data?.data?.data?.id),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list({ fieldOrder: 'order' }),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TrackData['id'], UpdateTrackPayload>) =>
            trackApi.updateTrackDraft(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackDraft = (
        variables: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateTrackDraft,
        ...mutation,
    };
};
