import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributionOrchestrationApis } from '../apis';
import { distributionOrchestrationQueryKeys } from '../constants/query-keys';

interface Variables extends CommonFunction {
    id: string;
    ticketId: string;
}

/** POST /distributions/:id/tickets/:ticketId/resolve — user đánh dấu flag đã sửa. */
export const useResolveTicket = () => {
    const { handleError, handleSuccess } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationKey: distributionOrchestrationQueryKeys.resolveTicket(),
        mutationFn: ({ id, ticketId }: Variables) =>
            distributionOrchestrationApis.resolveTicket(id, ticketId),
        onSuccess: (data, { id, onSuccess }) => {
            handleSuccess(data?.data);
            onSuccess?.();
            queryClient.invalidateQueries({
                queryKey: distributionOrchestrationQueryKeys.tickets(id),
            });
        },
        onError: (error, { onError }) => {
            handleError(error);
            onError?.(error);
        },
    });

    const resolveTicket = (variables: Variables) =>
        mutation.mutateAsync(variables);

    return { resolveTicket, ...mutation };
};
