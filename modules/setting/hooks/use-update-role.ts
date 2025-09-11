import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { settingApis } from '../apis';
import { settingQueryKeys } from '../constants/query-keys';
import { UpdateSetting } from '../types/payload';

export const useUpdateSetting = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (data: any, { onSuccess }: UpdateSetting) => {
        queryClient.invalidateQueries({
            queryKey: settingQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (error: any, { onError }: UpdateSetting) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationKey: settingQueryKeys.updates(),
        mutationFn: ({ payload }: UpdateSetting) =>
            settingApis.updateSetting(payload),
        onSuccess,
        onError,
    });

    const updateSetting = (variables: UpdateSetting) => {
        mutation.mutate(variables);
    };

    return {
        updateSetting,
        ...mutation,
    };
};
