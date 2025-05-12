import { showNotification } from '@/helpers/messages-helper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { UpdateUser } from '../types/data';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();

    const onSuccess = (data: any, { onSuccess }: UpdateUser) => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.getDetail });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.getInfo });
        showNotification('success', messages(data?.data?.message));
        onSuccess?.();
    };

    const onError = (data: any, { onError }: UpdateUser) => {
        showNotification('error', messages(data?.response?.data.message));
        onError?.(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateUser) => userApi.update(payload),
        onSuccess,
        onError,
    });

    const updateUser = (variables: UpdateUser) => {
        mutation.mutate(variables);
    };

    return { updateUser, ...mutation };
};
