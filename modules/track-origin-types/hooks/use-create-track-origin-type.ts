import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackOriginTypeApi } from '../apis';
import { trackOriginTypeQueryKeys } from '../constants/query-keys';
import { CreateTrackOriginTypePayload } from '../types/payload';

export const useCreateTrackOriginType = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackOriginTypePayload>
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
        { onError }: CreateVariables<CreateTrackOriginTypePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateTrackOriginTypePayload>) =>
            trackOriginTypeApi.createTrackOriginType(payload),
        onSuccess,
        onError,
    });

    const createTrackOriginType = (
        variables: CreateVariables<CreateTrackOriginTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackOriginType,
        ...mutation,
    };
};
