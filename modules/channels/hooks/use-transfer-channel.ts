import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelsData } from '../types';
import { TransferChannelTenantPayload } from '../types/payload';

export const useTransferChannel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const previewMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ChannelsData['id'], TransferChannelTenantPayload>) =>
            channelApi.previewTransfer(id, payload),
    });

    const transferMutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ChannelsData['id'], TransferChannelTenantPayload>) =>
            channelApi.transferChannel(id, payload),
        onSuccess: (data, { onSuccess }) => {
            queryClient.invalidateQueries({
                queryKey: channelQueryKeys.lists(),
            });
            const messageCode = data?.data?.messageCode;
            showNotification(
                'success',
                messageCode && messages.has(messageCode as any)
                    ? messages(messageCode as any)
                    : messages('channel.transfer.success')
            );
            onSuccess?.();
        },
        onError: (data, { onError }) => {
            onError?.();
            handleError(data);
        },
    });

    return {
        previewTransfer: previewMutation.mutateAsync,
        isPreviewing: previewMutation.isPending,
        transferChannel: transferMutation.mutate,
        isTransferring: transferMutation.isPending,
    };
};
