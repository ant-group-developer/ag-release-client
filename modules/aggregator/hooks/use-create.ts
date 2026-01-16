import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aggregatorApis } from '../apis';
import { aggregatorQueryKeys } from '../constants/query-keys';
import { CreateAggregatorPayload } from '../types/payloads';

export const useCreateAggregator = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateAggregatorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: aggregatorQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateAggregatorPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateAggregatorPayload>) =>
            aggregatorApis.create(payload),
        onSuccess,
        onError,
    });

    const createAggregator = (
        variables: CreateVariables<CreateAggregatorPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createAggregator,
        ...mutation,
    };
};
