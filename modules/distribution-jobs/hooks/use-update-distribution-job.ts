import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, SuccessResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { distributionJobApis } from '../apis';
import { distributionJobQueryKeys } from '../constants/query-keys';
import { UpdateDistributionJobPayload } from '../types';

export const useUpdateDistributionJob = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<SuccessResponse, any>,
        { onSuccess }: CommonFunction & { id: string } & UpdateDistributionJobPayload
    ) => {
        queryClient.invalidateQueries({
            queryKey: distributionJobQueryKeys.getList(),
        });
        onSuccess?.(data?.data);
        handleSuccess(data?.data);
    };

    const onError = (
        data: any,
        { onError }: CommonFunction & { id: string } & UpdateDistributionJobPayload
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            id,
            ...data
        }: { id: string } & UpdateDistributionJobPayload & CommonFunction) =>
            distributionJobApis.update(id, data),
        onSuccess,
        onError,
    });

    const updateDistributionJob = (
        variables: { id: string } & UpdateDistributionJobPayload & CommonFunction
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateDistributionJob,
        ...mutation,
    };
};
