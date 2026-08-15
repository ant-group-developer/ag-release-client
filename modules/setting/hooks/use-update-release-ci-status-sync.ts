import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseCiStatusSyncApis } from '../apis';
import { releaseCiStatusSyncQueryKeys } from '../constants/query-keys';
import { UpdateReleaseCiStatusSyncSchedulePayload } from '../types';

interface UpdateOptions {
    payload: UpdateReleaseCiStatusSyncSchedulePayload;
    onSuccess?: () => void;
    onError?: () => void;
}

interface RunNowOptions {
    onSuccess?: () => void;
    onError?: () => void;
}

export const useUpdateReleaseCiStatusSyncSchedule = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationKey: releaseCiStatusSyncQueryKeys.update(),
        mutationFn: ({ payload }: UpdateOptions) =>
            releaseCiStatusSyncApis.updateSchedule(payload),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: releaseCiStatusSyncQueryKeys.schedule(),
            });

            handleSuccess(data?.data);
            variables.onSuccess?.();
        },
        onError: (error, variables) => {
            variables.onError?.();
            handleError(error);
        },
    });

    const updateSchedule = (variables: UpdateOptions) => {
        mutation.mutate(variables);
    };

    return {
        updateSchedule,
        ...mutation,
    };
};

export const useRunNowReleaseCiStatusSync = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationKey: releaseCiStatusSyncQueryKeys.runNow(),
        mutationFn: () => releaseCiStatusSyncApis.runNow(),
        onSuccess: (data, variables: RunNowOptions) => {
            queryClient.invalidateQueries({
                queryKey: releaseCiStatusSyncQueryKeys.schedule(),
            });

            handleSuccess(data?.data);
            variables?.onSuccess?.();
        },
        onError: (error, variables: RunNowOptions) => {
            variables?.onError?.();
            handleError(error);
        },
    });

    const runNow = (options?: RunNowOptions) => {
        mutation.mutate(options || {});
    };

    return {
        runNow,
        ...mutation,
    };
};
