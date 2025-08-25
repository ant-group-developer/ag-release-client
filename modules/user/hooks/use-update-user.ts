import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import {
    BulkUpdateTenantUser,
    UpdateUser,
    UpdateUserRole,
} from '../types/data';

export const useUpdateUser = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess, userId }: UpdateUser) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.detail(userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.info() });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateUser) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload, userId }: UpdateUser) =>
            userApi.update(userId, payload),
        onSuccess,
        onError,
    });

    const updateUser = (variables: UpdateUser) => {
        mutation.mutate(variables);
    };

    return { updateUser, ...mutation };
};

export const useUpdateUserRole = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess, payload }: UpdateUserRole) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.role(payload.userId),
        });
        queryClient.invalidateQueries({ queryKey: userQueryKeys.info() });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateUserRole) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateUserRole) =>
            userApi.updateRole(payload),
        onSuccess,
        onError,
    });

    const updateUserRole = (variables: UpdateUserRole) => {
        mutation.mutate(variables);
    };

    return { updateUserRole, ...mutation };
};

export const useBulkUpdateTenantUser = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiError();

    const onSuccess = (
        data: any,
        { onSuccess, payload }: BulkUpdateTenantUser
    ) => {
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.detail(payload.userId),
        });
        queryClient.invalidateQueries({
            queryKey: userQueryKeys.lists(),
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: BulkUpdateTenantUser) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: BulkUpdateTenantUser) =>
            userApi.bulkUpdateTenantUser(payload),
        onSuccess,
        onError,
    });

    const bulkUpdateTenantUser = (variables: BulkUpdateTenantUser) => {
        mutation.mutate(variables);
    };

    return { bulkUpdateTenantUser, ...mutation };
};
