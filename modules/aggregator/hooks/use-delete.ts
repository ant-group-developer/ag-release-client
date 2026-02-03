import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aggregatorApis } from '../apis';
import { aggregatorQueryKeys } from '../constants/query-keys';
import { AggregatorData } from '../types';

export const useDeleteAggregator = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<AggregatorData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: aggregatorQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<AggregatorData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<AggregatorData['id']>) =>
            aggregatorApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteAggregator = (
        variables: DeleteVariables<AggregatorData['id']>
    ) => {
        mutation.mutate(variables);
    };

    return {
        deleteAggregator,
        ...mutation,
    };
};
