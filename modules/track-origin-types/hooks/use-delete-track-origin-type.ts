import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeData } from '../types';

export const useDeleteTrackOriginType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TrackOriginTypeData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackOriginTypeQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TrackOriginTypeData['id']>
    ) => {
        onError?.();
        handleError(data);
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
