import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';
import { ChannelAccessData } from '../types';

export function useGetChannelAccess(channelId?: string) {
    const { data, ...rest } = useQuery({
        queryKey: channelQueryKeys.access(channelId || ''),
        queryFn: () => channelApi.getAccess(channelId!),
        enabled: Boolean(channelId),
    });

    const accessList: ChannelAccessData[] = data?.data?.data ?? [];

    return {
        accessList,
        ...rest,
    };
}

export function useAddChannelAccess(channelId: string) {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: { userIds: string[] }) =>
            channelApi.addAccess(channelId, payload),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: channelQueryKeys.access(channelId),
            });
            const messageCode = res?.data?.messageCode;
            const msg = messageCode && messages.has(messageCode as any)
                ? messages(messageCode as any)
                : messages('common.success');
            showNotification('success', msg);
        },
        onError: (error: any) => {
            const response = error?.response?.data;
            const messageCode = response?.messageCode;
            const msg = messageCode && messages.has(messageCode as any)
                ? messages(messageCode as any)
                : response?.message || messages('common.error');
            showNotification('error', msg);
        },
    });

    return {
        addAccess: mutation.mutate,
        isPending: mutation.isPending,
    };
}

export function useRemoveChannelAccess(channelId: string) {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (userId: string) =>
            channelApi.removeAccess(channelId, { userIds: [userId] }),
        onSuccess: (res) => {
            queryClient.invalidateQueries({
                queryKey: channelQueryKeys.access(channelId),
            });
            const messageCode = res?.data?.messageCode;
            const msg = messageCode && messages.has(messageCode as any)
                ? messages(messageCode as any)
                : messages('common.success');
            showNotification('success', msg);
        },
        onError: (error: any) => {
            const response = error?.response?.data;
            const messageCode = response?.messageCode;
            const msg = messageCode && messages.has(messageCode as any)
                ? messages(messageCode as any)
                : response?.message || messages('common.error');
            showNotification('error', msg);
        },
    });

    return {
        removeAccess: mutation.mutate,
        isPending: mutation.isPending,
    };
}
