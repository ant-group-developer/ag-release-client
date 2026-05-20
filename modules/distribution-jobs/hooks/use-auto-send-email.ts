import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, SuccessResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { distributionJobApis } from '../apis';
import { distributionJobQueryKeys } from '../constants/query-keys';

export const useAutoSendEmailDistributionJobs = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<SuccessResponse, any>,
        { onSuccess }: CommonFunction & { ids: any[] }
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
        { onError }: CommonFunction & { ids: any[] }
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ ids }: { ids: any[] } & CommonFunction) =>
            distributionJobApis.autoSendEmail(ids),
        onSuccess,
        onError,
    });

    const autoSendEmail = (variables: { ids: any[] } & CommonFunction) => {
        mutation.mutate(variables);
    };

    return {
        autoSendEmail,
        ...mutation,
    };
};
