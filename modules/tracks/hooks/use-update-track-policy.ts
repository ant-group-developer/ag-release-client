import { useApiError } from '@/hooks/use-api-error';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackApi } from '../apis';
import { UpdateTrackPolicy } from '../types/payload';

export const useUpdateTrackPolicy = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();

    const onSuccess = (data: any, { onSuccess }: UpdateTrackPolicy) => {
        onSuccess?.(data?.data?.data);
    };

    const onError = (data: any, { onError }: UpdateTrackPolicy) => {
        handleError(data);
        onError?.();
    };

    const mutation = useMutation({
        mutationFn: ({ id, trackPolicyId, actionId }: UpdateTrackPolicy) =>
            trackApi.updateTrackPolicy(id, trackPolicyId, actionId),
        onSuccess,
        onError,
    });

    const updateTrackPolicy = (variables: {
        id: string;
        trackPolicyId: string;
        actionId: string;
    }) => {
        return mutation.mutate(variables);
    };

    return {
        updateTrackPolicy,
        ...mutation,
    };
};
