import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspDealApis } from '../apis';
import { dspDealQueryKeys } from '../constants/query-keys';
import { CreateDspDealPayload } from '../types/payload';

export const useCreateDspDeal = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateDspDealPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspDealQueryKeys.lists(),
        });

        handleSuccess(data?.data);

        onSuccess?.();
    };

    const onError = (
        error: any,
        { onError }: CreateVariables<CreateDspDealPayload>
    ) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateDspDealPayload>) =>
            dspDealApis.create(payload.dspId, payload),
        onSuccess,
        onError,
    });

    const createDspDeal = (
        variables: CreateVariables<CreateDspDealPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createDspDeal,
        ...mutation,
    };
};
