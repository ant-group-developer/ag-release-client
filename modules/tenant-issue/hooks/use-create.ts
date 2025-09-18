import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantIssueApis } from '../apis';
import { tenantIssuesQueryKeys } from '../constants/query-keys';
import { CreateTenantIssuePayload } from '../types/payloads';

export const useCreateTenantIssue = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTenantIssuePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantIssuesQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateTenantIssuePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTenantIssuePayload>) =>
            tenantIssueApis.create(payload),
        onSuccess,
        onError,
    });

    const createTenantIssue = (
        variables: CreateVariables<CreateTenantIssuePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTenantIssue,
        ...mutation,
    };
};
