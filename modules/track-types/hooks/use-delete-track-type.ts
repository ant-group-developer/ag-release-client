import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { TrackTypeData } from '../types';

export const useDeleteTrackType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

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
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
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
