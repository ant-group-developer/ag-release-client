import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { TrackTypeData } from '../types';

export const useDeleteTrackType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackTypeData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackTypeQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackTypeData['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackTypeData['id']>) =>
            trackTypeApi.deleteTrackType(id),
        onSuccess,
        onError,
    });

    const deleteTrackType = (
        variables: DeleteVariables<TrackTypeData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTrackType,
        ...mutation,
    };
};
