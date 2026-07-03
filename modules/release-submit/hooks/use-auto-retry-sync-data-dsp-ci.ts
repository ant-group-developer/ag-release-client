import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { releaseSubmitApis } from '../apis';
import { releaseSubmitQueryKeys } from '../constants/query-keys';

export const useAutoRetrySyncDataDspCi = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<any, any>,
        { onSuccess }: CommonFunction = {}
    ) => {
        queryClient.invalidateQueries({
            queryKey: [releaseSubmitQueryKeys.all],
        });
        onSuccess?.(data?.data?.data);
        handleSuccess(data?.data);
    };

    const onError = (
        data: any,
        { onError }: CommonFunction = {}
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: (callbacks: CommonFunction = {}) =>
            releaseSubmitApis.autoRetrySyncDataDspCi(),
        onSuccess,
        onError,
    });

    const autoRetrySyncDataDspCi = (callbacks?: CommonFunction) => {
        mutation.mutate(callbacks);
    };

    return {
        autoRetrySyncDataDspCi,
        ...mutation,
    };
};
