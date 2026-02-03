import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dealTypeApis } from '../apis';
import { dealTypeQueryKeys } from '../constants/query-keys';
import { CreateDealTypePayload } from '../types/payloads';

export const useCreateDealType = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateDealTypePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dealTypeQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateDealTypePayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateDealTypePayload>) =>
            dealTypeApis.create(payload),
        onSuccess,
        onError,
    });

    const createDealType = (
        variables: CreateVariables<CreateDealTypePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createDealType,
        ...mutation,
    };
};
