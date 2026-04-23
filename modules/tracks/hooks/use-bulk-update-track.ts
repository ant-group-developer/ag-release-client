import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { BulkUpdateTrackPayload } from '../types/payload';

export const useBulkUpdateTrack = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: BulkUpdateTrackPayload) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (data: any, { onError }: BulkUpdateTrackPayload) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: (payload: BulkUpdateTrackPayload) =>
            trackApi.bulkUpdateTrack(payload),
        onSuccess,
        onError,
    });

    const bulkUpdateTrack = (variables: BulkUpdateTrackPayload) => {
        return mutation.mutate(variables);
    };

    return {
        bulkUpdateTrack,
        ...mutation,
    };
};
