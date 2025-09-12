import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackSensitiveApis } from '../apis';
import { trackSensitiveQueryKeys } from '../constants/query-keys';
import { TrackSensitiveData } from '../types';

export const useDeleteTrackSensitive = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackSensitiveData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackSensitiveQueryKeys.lists(),
        });

        handleSuccess(data?.data?.messageCode);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackSensitiveData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackSensitiveData['id']>) =>
            trackSensitiveApis.deleteTrackSensitive(id),
        onSuccess,
        onError,
    });

    const deleteTrackSensitive = (
        variables: DeleteVariables<TrackSensitiveData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTrackSensitive,
        ...mutation,
    };
};
