import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { releaseDspApis } from '../apis';
import { ReleaseDspBulkUpdate } from '../types/payloads';

export const useBulkUpdateReleaseDsp = () => {
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (payload: ReleaseDspBulkUpdate) =>
            releaseDspApis.bulkUpdate(payload.items),
        onSuccess(data, variables, context) {
            handleSuccess(data);
            variables?.onSuccess?.();
        },
        onError(error, variables, context) {
            handleError(error);
            variables?.onError?.(error);
        },
    });

    const bulkUpdate = (payload: ReleaseDspBulkUpdate) => {
        mutation.mutate(payload);
    };

    return {
        bulkUpdate,
        ...mutation,
    };
};
