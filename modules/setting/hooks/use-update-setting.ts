import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { settingApi } from '../apis';
import { settingQueryKeys } from '../constants';
import { UpdateSetting } from '../types';

export const useUpdateSetting = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UpdateSetting) => {
        queryClient.invalidateQueries({
            queryKey: settingQueryKeys.getSettingPrivate,
        });
        queryClient.invalidateQueries({
            queryKey: settingQueryKeys.getSettingPublic,
        });
        showNotification('success', messages(data.data.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: UpdateSetting) => {
        const errors = data.response.data.errors;
        showNotification('error', messages(data?.response?.data?.message));
        onError?.(errors);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateSetting) =>
            settingApi.updateSetting(payload),
        onSuccess,
        onError,
    });

    const updateSetting = (variables: UpdateSetting) => {
        mutation.mutate(variables);
    };

    return { updateSetting, ...mutation };
};
