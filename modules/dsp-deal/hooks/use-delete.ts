import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspDealApis } from '../apis';
import { dspDealQueryKeys } from '../constants/query-keys';
import { DspDealData } from '../types';

export const useDeleteDspDeal = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<DspDealData['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: dspDealQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<DspDealData['id']>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<DspDealData['id']>) =>
            dspDealApis.delete(id),
        onSuccess,
        onError,
    });

    const deleteDspDeal = (variables: DeleteVariables<DspDealData['id']>) => {
        mutation.mutate(variables);
    };

    return {
        deleteDspDeal,
        ...mutation,
    };
};
