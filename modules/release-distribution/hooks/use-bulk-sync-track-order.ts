import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';

export interface BulkSyncTrackOrderVariables extends CommonFunction {
    payload?: {
        ids?: string[];
    };
}

export function useBulkSyncTrackOrder() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError, handleSuccess } = useApiNotify();

    const handleOnSuccess = (data: any, variables?: BulkSyncTrackOrderVariables) => {
        queryClient.invalidateQueries({
            queryKey: releaseDistributionQueryKeys.lists(),
        });
        handleSuccess(data?.data);
        variables?.onSuccess?.();
    };

    const handleOnError = (error: any, variables?: BulkSyncTrackOrderVariables) => {
        handleError(error);
        variables?.onError?.();
    };

    const mutation = useMutation({
        mutationFn: (variables?: BulkSyncTrackOrderVariables) =>
            releaseDistributionApi.bulkSyncTrackOrder(variables?.payload),
        onSuccess: (data, variables) => handleOnSuccess(data, variables),
        onError: (error, variables) => handleOnError(error, variables),
    });

    const bulkSyncTrackOrder = (variables?: BulkSyncTrackOrderVariables) => {
        mutation.mutate(variables);
    };

    return { ...mutation, bulkSyncTrackOrder };
}
