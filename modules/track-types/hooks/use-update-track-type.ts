import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { TrackTypeData } from '../types';
import { UpdateTrackTypePayload } from '../types/payload';

export const useUpdateTrackType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<TrackTypeData['id'], UpdateTrackTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackTypeQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        {
            onError,
        }: UpdateVariables<TrackTypeData['id'], UpdateTrackTypePayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationKey: trackTypeQueryKeys.updates(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TrackTypeData['id'], UpdateTrackTypePayload>) =>
            trackTypeApi.updateTrackType(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackType = (
        variables: UpdateVariables<TrackTypeData['id'], UpdateTrackTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTrackType,
        ...mutation,
    };
};
