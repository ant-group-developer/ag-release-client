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

type UseAddChannelAccessOptions = {
    channelId?: string;
    userId?: string;
};

export function useAddChannelAccess(options?: UseAddChannelAccessOptions) {
    const channelIdParam = options?.channelId;
    const userIdParam = options?.userId;

    const messages = useTranslations();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (payload: {
            channelId?: string;
            userIds: string[];
            userId?: string;
        }) => {
            const targetChannelId = payload.channelId || channelIdParam;
            return channelApi.addAccess(targetChannelId!, {
                userIds: payload.userIds,
            });
        },
        onSuccess: (res, variables) => {
            const resData = res?.data?.data;
            const channelId =
                variables.channelId || channelIdParam || resData?.channelId;
            const userId = variables.userId || userIdParam || resData?.userId;

            if (channelId) {
                queryClient.invalidateQueries({
                    queryKey: channelQueryKeys.access(channelId),
                });
            }
            if (userId) {
                queryClient.invalidateQueries({
                    queryKey: channelQueryKeys.userChannels(userId),
                });
            }

            const messageCode = res?.data?.messageCode;
            const msg =
                messageCode && messages.has(messageCode as any)
                    ? messages(messageCode as any)
                    : messages('common.success');
            showNotification('success', msg);
        },
        onError: (error: any) => {
            const response = error?.response?.data;
            const messageCode = response?.messageCode;
            const msg =
                messageCode && messages.has(messageCode as any)
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

export function useRemoveChannelAccess(options?: UseAddChannelAccessOptions) {
    const channelIdParam = options?.channelId;
    const userIdParam = options?.userId;

    const messages = useTranslations();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: string) => channelApi.removeAccess(id),
        onSuccess: (res) => {
            const resData = res?.data?.data;
            const channelId = channelIdParam || resData?.channelId;
            const userId = userIdParam || resData?.userId;

            if (channelId) {
                queryClient.invalidateQueries({
                    queryKey: channelQueryKeys.access(channelId),
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: [...channelQueryKeys.all, 'access'],
                });
            }

            if (userId) {
                queryClient.invalidateQueries({
                    queryKey: channelQueryKeys.userChannels(userId),
                });
            } else {
                queryClient.invalidateQueries({
                    queryKey: [...channelQueryKeys.all, 'user'],
                });
            }

            const messageCode = res?.data?.messageCode;
            const msg =
                messageCode && messages.has(messageCode as any)
                    ? messages(messageCode as any)
                    : messages('common.success');
            showNotification('success', msg);
        },
        onError: (error: any) => {
            const response = error?.response?.data;
            const messageCode = response?.messageCode;
            const msg =
                messageCode && messages.has(messageCode as any)
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
