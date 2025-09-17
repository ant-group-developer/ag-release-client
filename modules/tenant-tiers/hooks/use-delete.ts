import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tenantTiersApis } from '../apis';
import { tenantTiersQueryKeys } from '../constants/query-keys';
import { TenantTiersData } from '../types';

export const useDeleteTenantTiers = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<TenantTiersData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: tenantTiersQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<TenantTiersData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<TenantTiersData['id']>) =>
            tenantTiersApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteTenantTiers = (
        variables: DeleteVariables<TenantTiersData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteTenantTiers,
        ...mutation,
    };
};
