import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';
import { SubmitDistributionPayload } from '../types';

interface Variables extends CommonFunction {
    payload: SubmitDistributionPayload;
}

/** POST /distributions — submit distribution. onSuccess trả `{ distributionId }`. */
export const useSubmitDistribution = () => {
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationKey: distributionOrchestrationQueryKeys.submit(),
        mutationFn: ({ payload }: Variables) =>
            distributionOrchestrationApis.submit(payload),
        onSuccess: (data, { onSuccess }) => {
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }) => {
            handleError(error);
            onError?.(error);
        },
    });

    const submitDistribution = (variables: Variables) =>
        mutation.mutateAsync(variables);

    return { submitDistribution, ...mutation };
};
