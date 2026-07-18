import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingApis } from '../apis';
import { settingQueryKeys } from '../constants/query-keys';

export const useRefreshCiToolToken = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: () => settingApis.refreshCiToolToken(),
        onSuccess: (response) => {
            queryClient.invalidateQueries({
                queryKey: settingQueryKeys.details(),
            });
            handleSuccess(response.data);
        },
        onError: handleError,
    });

    return {
        refreshCiToolToken: mutation.mutate,
        ...mutation,
    };
};

export const useTestCiToken = () => {
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: () => settingApis.testCiToken(),
        onSuccess: (response) => {
            handleSuccess(response.data);
        },
        onError: handleError,
    });

    return {
        testCiToken: mutation.mutate,
        ...mutation,
    };
};
