import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, SuccessResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { distributionJobApis } from '../apis';
import { distributionJobQueryKeys } from '../constants/query-keys';

export const useConfirmCompletedDistributionJobs = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<SuccessResponse, any>,
        { onSuccess }: CommonFunction & { ids: any[]; exportIdFromCi: string }
    ) => {
        // queryClient.invalidateQueries({
        //     queryKey: distributionJobQueryKeys.getList(),
        // });
        queryClient.invalidateQueries({
            queryKey: distributionJobQueryKeys.getListGrouped(),
        });
        onSuccess?.(data?.data);
        handleSuccess(data?.data);
    };

    const onError = (
        data: any,
        { onError }: CommonFunction & { ids: any[]; exportIdFromCi: string }
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({
            ids,
            exportIdFromCi,
        }: { ids: any[]; exportIdFromCi: string } & CommonFunction) =>
            distributionJobApis.confirmCompleted({ ids, exportIdFromCi }),
        onSuccess,
        onError,
    });

    const confirmCompleted = (
        variables: { ids: any[]; exportIdFromCi: string } & CommonFunction
    ) => {
        mutation.mutate(variables);
    };

    return {
        confirmCompleted,
        ...mutation,
    };
};
