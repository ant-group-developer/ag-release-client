import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { tenantIssueApis } from '../apis';
import { tenantIssuesQueryKeys } from '../constants/query-keys';
import { TenantIssueData } from '../types';
import { UpdateTenantIssuePayload } from '../types/payloads';

export const useUpdateTenantIssue = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<TenantIssueData['id'], UpdateTenantIssuePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantIssuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<TenantIssueData['id'], UpdateTenantIssuePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationKey: tenantIssuesQueryKeys.updates(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<TenantIssueData['id'], UpdateTenantIssuePayload>) =>
            tenantIssueApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateTenantIssue = (
        variables: UpdateVariables<
            TenantIssueData['id'],
            UpdateTenantIssuePayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateTenantIssue,
        ...mutation,
    };
};
