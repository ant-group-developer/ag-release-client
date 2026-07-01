import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseDistributionApi } from '../apis';
import { releaseDistributionQueryKeys } from '../constants/query-keys';

export function useAutoSyncCi() {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError, handleSuccess } = useApiNotify();

    const handleOnSuccess = (data: any, { onSuccess }: CommonFunction = {}) => {
        queryClient.invalidateQueries({
            queryKey: releaseDistributionQueryKeys.lists(),
        });
        handleSuccess(data?.data);
        onSuccess?.();
    };

    const handleOnError = (error: any, { onError }: CommonFunction = {}) => {
        handleError(error);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: () => releaseDistributionApi.autoSyncCi(),
        onSuccess: handleOnSuccess,
        onError: handleOnError,
    });

    const autoSyncCi = (variables?: CommonFunction) => {
        mutation.mutate(variables);
    };

    return { ...mutation, autoSyncCi };
}
