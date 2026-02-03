import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dealTypeApis } from '../apis';
import { dealTypeQueryKeys } from '../constants/query-keys';
import { DealTypeData } from '../types';

export const useDeleteDealType = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<DealTypeData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dealTypeQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<DealTypeData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<DealTypeData['id']>) =>
            dealTypeApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteDealType = (variables: DeleteVariables<DealTypeData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteDealType,
        ...mutation,
    };
};
