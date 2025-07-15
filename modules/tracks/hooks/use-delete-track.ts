import { showNotification } from '@/helpers/messages-helper';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { TrackData } from '../types';

export const useDeleteTrack = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackQueryKeys.getList],
        });
        // queryClient.invalidateQueries({
        //     queryKey: [...releasesQueryKeys.getDetail],
        // });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackData['id']>) =>
            trackApi.deleteTrack(id),
        onSuccess,
        onError,
    });

    const deleteTrack = (variables: DeleteVariables<TrackData['id']>) => {
        return mutation.mutate(variables);
    };

    return {
        deleteTrack,
        ...mutation,
    };
};
