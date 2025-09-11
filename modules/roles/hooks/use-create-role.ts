import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { rolesApis } from '../apis';
import { rolesQueryKeys } from '../constants/query-keys';
import { CreateRolePayload } from '../types/payload';

export const useCreateRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateRolePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: rolesQueryKeys.lists(),
        });
        const responseMessages = messages(data?.data?.messageCode);
        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateRolePayload>
    ) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateRolePayload>) =>
            rolesApis.createRoles(payload),
        onSuccess,
        onError,
    });

    const createRole = (variables: CreateVariables<CreateRolePayload>) => {
        mutation.mutate(variables);
    };

    return {
        createRole,
        ...mutation,
    };
};
