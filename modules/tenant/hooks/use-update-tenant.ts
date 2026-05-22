import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantApi } from '../api';
import { tenantQueryKeys } from '../constants';
import {
    UpdateTenant,
    UpdateTenantDsp,
    UpdateTenantDspAgreement,
} from '../types/data';

export const useUpdateTenant = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess, tenantId }: UpdateTenant) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.detail(tenantId),
        });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.active() });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateTenant) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload, tenantId }: UpdateTenant) =>
            tenantApi.update(tenantId, payload),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const updateTenant = (variables: UpdateTenant) => {
        mutation.mutate(variables);
    };

    return { updateTenant, ...mutation };
};

export const useUpdateTenantDsp = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, payload: { tenantId } }: UpdateTenantDsp
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.dsp(tenantId),
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateTenantDsp) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: UpdateTenantDsp) =>
            tenantApi.updateDsp(payload),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const updateTenantDsp = (variables: UpdateTenantDsp) => {
        mutation.mutate(variables);
    };

    return { updateTenantDsp, ...mutation };
};

export const useUpdateTenantDspAgreement = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess, tenantId }: UpdateTenantDspAgreement
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantQueryKeys.dspAgreements(),
        });
        showNotification('success', messages('message.updateSuccessfully'));
        onSuccess?.();
    };

    const onError = (error: any, { onError }: UpdateTenantDspAgreement) => {
        handleError(error);
        onError?.(error);
    };

    const mutation = useMutation({
        mutationFn: ({ tenantId, dspId, payload }: UpdateTenantDspAgreement) =>
            tenantApi.updateTenantDspAgreement(tenantId, dspId, payload),
        onSuccess,
        onError,
        mutationKey: tenantQueryKeys.updates(),
    });

    const updateTenantDspAgreement = (variables: UpdateTenantDspAgreement) => {
        return mutation.mutateAsync(variables);
    };

    return { updateTenantDspAgreement, ...mutation };
};
