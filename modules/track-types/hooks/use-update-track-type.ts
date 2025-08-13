import { showNotification } from '@/helpers/messages-helper';
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
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        {
            onError,
        }: UpdateVariables<TrackTypeData['id'], UpdateTrackTypePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
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
