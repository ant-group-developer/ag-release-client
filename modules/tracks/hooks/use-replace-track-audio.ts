import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DetailResponse, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackData } from '../types';
import { ReplaceTrackAudioPayload } from '../types/payload';

export const useReplaceTrackAudio = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<DetailResponse<TrackData>>,
        {
            onSuccess,
            id,
        }: UpdateVariables<TrackData['id'], ReplaceTrackAudioPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(id),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.listsTracksPolicies(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        error: any,
        { onError }: UpdateVariables<TrackData['id'], ReplaceTrackAudioPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TrackData['id'], ReplaceTrackAudioPayload>) =>
            trackApi.replaceTrackAudio(id, payload),
        onSuccess,
        onError,
    });

    const replaceTrackAudio = (
        variables: UpdateVariables<TrackData['id'], ReplaceTrackAudioPayload>
    ) => {
        return mutation.mutate(variables);
    };

    const replaceTrackAudioAsync = (
        variables: UpdateVariables<TrackData['id'], ReplaceTrackAudioPayload>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        replaceTrackAudio,
        replaceTrackAudioAsync,
        ...mutation,
    };
};
