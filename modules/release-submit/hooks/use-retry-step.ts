import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, DetailResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { releaseSubmitApis } from '../apis';
import { releaseSubmitQueryKeys } from '../constants/query-keys';

export const useRetryReleaseSubmitStep = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<DetailResponse<any>, any>,
        { onSuccess, stepId }: { stepId: string } & CommonFunction
    ) => {
        queryClient.invalidateQueries({
            queryKey: [releaseSubmitQueryKeys.all],
        });
        onSuccess?.(data?.data?.data);
        handleSuccess(data?.data);
    };

    const onError = (
        data: any,
        { onError }: { stepId: string } & CommonFunction
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ stepId }: { stepId: string } & CommonFunction) =>
            releaseSubmitApis.retryStep(stepId),
        onSuccess,
        onError,
    });

    const retryStep = (variables: { stepId: string } & CommonFunction) => {
        mutation.mutate(variables);
    };

    return {
        retryStep,
        ...mutation,
    };
};
