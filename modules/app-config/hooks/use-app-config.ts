import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse } from '@/types/api';
import {
    useMutation,
    useQuery,
    useQueryClient,
    UseQueryOptions,
} from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { appConfigApi } from '../apis';
import { AppConfigShape, UpdateConfigPayload } from '../types';

export const appConfigKeys = {
    all: ['app-config'],
    details: () => [...appConfigKeys.all, 'detail'] as const,
};

export const useAppConfig = () => {
    const { handleError } = useApiNotify();
    return useQuery<DetailResponse<AppConfigShape>>({
        queryKey: appConfigKeys.details(),
        queryFn: async () => {
            const response = await appConfigApi.get();
            return response.data;
        },
        onError: handleError,
    } as UseQueryOptions<DetailResponse<AppConfigShape>>);
};

export const useUpdateAppConfig = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    return useMutation({
        mutationFn: ({ data }: { data: UpdateConfigPayload }) =>
            appConfigApi.update(data),
        onSuccess: (_, {}) => {
            queryClient.invalidateQueries({
                queryKey: appConfigKeys.details(),
            });
            showNotification(
                'success',
                messages('action.update.success', {
                    label: messages('setting.label'),
                })
            );
        },
        onError: handleError,
    });
};
