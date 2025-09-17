import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantTiersApis } from '../apis';
import { tenantTiersQueryKeys } from '../constants/query-keys';
import { CreateTenantTiersPayload } from '../types/payloads';

export const useCreateTenantTiers = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTenantTiersPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantTiersQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateTenantTiersPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTenantTiersPayload>) =>
            tenantTiersApis.create(payload),
        onSuccess,
        onError,
    });

    const createTenantTiers = (
        variables: CreateVariables<CreateTenantTiersPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTenantTiers,
        ...mutation,
    };
};
