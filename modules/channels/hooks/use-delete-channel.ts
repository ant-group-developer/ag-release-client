import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelsData } from '../types';

export const useDeleteChannel = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ChannelsData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: channelQueryKeys.lists(),
        });

        showNotification('success', messages(data.data.messageCode));
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ChannelsData['id']>
    ) => {
        handleError(data);

        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ChannelsData['id']>) =>
            channelApi.deleteChannel(id),
        onSuccess,
        onError,
    });

    const deleteChannel = (variables: DeleteVariables<ChannelsData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteChannel,
        ...mutation,
    };
};
