import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { aggregatorApis } from '../apis';
import { aggregatorQueryKeys } from '../constants/query-keys';
import { AggregatorData } from '../types';
import { UpdateAggregatorPayload } from '../types/payloads';

export const useUpdateAggregator = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
            id,
        }: UpdateVariables<AggregatorData['id'], UpdateAggregatorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: aggregatorQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: aggregatorQueryKeys.detail(id),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        error: any,
        {
            onError,
        }: UpdateVariables<AggregatorData['id'], UpdateAggregatorPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationKey: aggregatorQueryKeys.update(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<AggregatorData['id'], UpdateAggregatorPayload>) =>
            aggregatorApis.update(id, payload),
        onSuccess,
        onError,
    });

    const updateAggregator = (
        variables: UpdateVariables<
            AggregatorData['id'],
            UpdateAggregatorPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateAggregator,
        ...mutation,
    };
};
