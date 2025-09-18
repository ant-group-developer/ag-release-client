import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantIssueApis } from '../apis';
import { tenantIssuesQueryKeys } from '../constants/query-keys';
import { TenantIssueData } from '../types';

export const useDeleteTenantIssue = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TenantIssueData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantIssuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TenantIssueData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TenantIssueData['id']>) =>
            tenantIssueApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteTenantIssue = (
        variables: DeleteVariables<TenantIssueData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTenantIssue,
        ...mutation,
    };
};
