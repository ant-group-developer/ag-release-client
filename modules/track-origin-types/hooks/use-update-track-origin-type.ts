import { showNotification } from '@/helpers/messages-helper';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { TrackOriginTypeData } from '../types';
import { UpdateTrackOriginTypePayload } from '../types/payload';

export const useUpdateTrackOriginType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<
            TrackOriginTypeData['id'],
            UpdateTrackOriginTypePayload
        >
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
        {
            onError,
        }: UpdateVariables<
            TrackOriginTypeData['id'],
            UpdateTrackOriginTypePayload
        >
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
        }: UpdateVariables<
            TrackOriginTypeData['id'],
            UpdateTrackOriginTypePayload
        >) => trackOriginTypeApi.updateTrackOriginType(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackOriginType = (
        variables: UpdateVariables<
            TrackOriginTypeData['id'],
            UpdateTrackOriginTypePayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTrackOriginType,
        ...mutation,
    };
};
