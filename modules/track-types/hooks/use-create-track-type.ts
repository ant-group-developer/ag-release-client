import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackTypeApi } from '../apis';
import { trackTypeQueryKeys } from '../constants/query-keys';
import { CreateTrackTypePayload } from '../types/payload';

export const useCreateTrackType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackTypePayload>
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
        { onError }: CreateVariables<CreateTrackTypePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTrackTypePayload>) =>
            trackTypeApi.createTrackType(payload),
        onSuccess,
        onError,
    });

    const createTrackType = (
        variables: CreateVariables<CreateTrackTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackType,
        ...mutation,
    };
};
