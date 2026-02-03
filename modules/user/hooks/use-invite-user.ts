import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { InviteUser } from '../types/data';

export function useInviteUser() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const handleOnSuccess = (data: any, { onSuccess }: InviteUser) => {
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        showNotification(
            'success',
            messages('action.invite.success', {
                label: messages('user.label'),
            })
        );
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: InviteUser) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: InviteUser) => userApi.invite(payload),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const inviteUser = (variables: InviteUser) => {
        mutation.mutate(variables);
    };

    return { ...mutation, inviteUser };
}
