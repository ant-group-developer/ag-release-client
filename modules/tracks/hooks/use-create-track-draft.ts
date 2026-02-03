import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { trackQueryKeys } from '../constants/query-keys';
import { TrackPayload } from '../types/payload';

export const useCreateTrackDraft = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<TrackPayload[]>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data.data.data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<TrackPayload[]>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<TrackPayload[]>) =>
            trackApi.createTrackDraft({ trackDrafts: payload }),
        onSuccess,
        onError,
    });

    const createTrackDraft = (variables: CreateVariables<TrackPayload[]>) => {
        return mutation.mutate(variables);
    };

    return {
        createTrackDraft,
        ...mutation,
    };
};
