import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackSensitiveApis } from '../apis';
import { trackSensitiveQueryKeys } from '../constants/query-keys';
import { CreateTrackSensitivePayload } from '../types/payload';
export const useCreateTrackSensitive = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackSensitivePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackSensitiveQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateTrackSensitivePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateTrackSensitivePayload>) =>
            trackSensitiveApis.createTrackSensitive(payload),
        onSuccess,
        onError,
    });

    const createTrackSensitive = (
        variables: CreateVariables<CreateTrackSensitivePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackSensitive,
        ...mutation,
    };
};
