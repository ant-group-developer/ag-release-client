import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { CreateChannelPayload } from '../types/payload';

export const useCreateChannel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateChannelPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: channelQueryKeys.lists(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateChannelPayload>
    ) => {
        onError?.(data);
        // handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateChannelPayload>) =>
            channelApi.createChannel(payload),
        onSuccess,
        onError,
    });

    const createChannel = (variable: CreateVariables<CreateChannelPayload>) => {
        mutation.mutate(variable);
    };

    return {
        createChannel,
        ...mutation,
    };
};
