import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelsData } from '../types';
import { UpdateChannelPayload } from '../types/payload';

export const useUpdateChannel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: UpdateVariables<ChannelsData['id'], UpdateChannelPayload>
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
        { onError }: UpdateVariables<ChannelsData['id'], UpdateChannelPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ChannelsData['id'], UpdateChannelPayload>) =>
            channelApi.updateChannel(id, payload),
        onSuccess,
        onError,
    });

    const updateChannel = (
        variable: UpdateVariables<ChannelsData['id'], UpdateChannelPayload>
    ) => {
        mutation.mutate(variable);
    };

    return {
        updateChannel,
        ...mutation,
    };
};
