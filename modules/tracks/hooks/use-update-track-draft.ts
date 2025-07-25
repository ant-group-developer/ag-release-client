import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { TrackData } from '../types';
import { UpdateTrackPayload } from '../types/payload';

export const useUpdateTrackDraft = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...releasesQueryKeys.getDetail],
        });

        // queryClient.invalidateQueries({
        //     queryKey: [...trackQueryKeys.getList],
        // });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: UpdateVariables<TrackData['id'], UpdateTrackPayload>
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
        }: UpdateVariables<TrackData['id'], UpdateTrackPayload>) =>
            trackApi.updateTrackDraft(id, payload),
        onSuccess,
        onError,
    });

    const updateTrackDraft = (
        variables: UpdateVariables<TrackData['id'], UpdateTrackPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        updateTrackDraft,
        ...mutation,
    };
};
