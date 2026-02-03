import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { UpdateTrackOrderPayload } from '../types/payload';

export const useUpdateTrackOrder = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: UpdateTrackOrderPayload) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: UpdateTrackOrderPayload) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: (payload: UpdateTrackOrderPayload) =>
            trackApi.updateTrackOrder(payload),
        onSuccess,
        onError,
    });

    const updateTrackOrder = (variables: UpdateTrackOrderPayload) => {
        return mutation.mutate(variables);
    };

    return {
        updateTrackOrder,
        ...mutation,
    };
};
