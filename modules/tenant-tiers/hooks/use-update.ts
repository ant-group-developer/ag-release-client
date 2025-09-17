import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantTiersApis } from '../apis';
import { tenantTiersQueryKeys } from '../constants/query-keys';
import { TenantTiersData } from '../types';
import { UpdateTenantTiersPayload } from '../types/payloads';

export const useUpdateTenantTiers = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<TenantTiersData['id'], UpdateTenantTiersPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantTiersQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<TenantTiersData['id'], UpdateTenantTiersPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TenantTiersData['id'], UpdateTenantTiersPayload>) =>
            tenantTiersApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateTenantTiers = (
        variables: UpdateVariables<
            TenantTiersData['id'],
            UpdateTenantTiersPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTenantTiers,
        ...mutation,
    };
};
