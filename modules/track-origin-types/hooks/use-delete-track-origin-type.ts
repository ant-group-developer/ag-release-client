import { showNotification } from '@/helpers/messages-helper';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeData } from '../types';

export const useDeleteTrackOriginType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackOriginTypeData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackOriginTypeQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackOriginTypeData['id']>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TrackOriginTypeData['id']>) =>
            trackOriginTypeApi.deleteTrackOriginType(id),
        onSuccess,
        onError,
    });

    const deleteTrackOriginType = (
        variables: DeleteVariables<TrackOriginTypeData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTrackOriginType,
        ...mutation,
    };
};
