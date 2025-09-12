import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackSensitiveApis } from '../apis';
import { trackSensitiveQueryKeys } from '../constants/query-keys';
import { TrackSensitiveData } from '../types';
import { UpdateTrackSensitivePayload } from '../types/payload';

export const useUpdateTrackSensitive = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<
            TrackSensitiveData['id'],
            UpdateTrackSensitivePayload
        >
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackSensitiveQueryKeys.lists(),
        });

        handleSuccess(data?.data?.messageCode);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<
            TrackSensitiveData['id'],
            UpdateTrackSensitivePayload
        >
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            TrackSensitiveData['id'],
            UpdateTrackSensitivePayload
        >) => trackSensitiveApis.updateTrackSensitive(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackSensitive = (
        variables: UpdateVariables<
            TrackSensitiveData['id'],
            UpdateTrackSensitivePayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTrackSensitive,
        ...mutation,
    };
};
