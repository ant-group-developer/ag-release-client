import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseArtistApi } from '../apis';
import { BulkCreateReleaseArtistPayload } from '../types/payload';

export const useBulkCreateReleaseArtist = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        {
            onSuccess,
            payload,
        }: CreateVariables<BulkCreateReleaseArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list(),
        });
        if (payload.items?.[0]?.releaseId) {
            queryClient.invalidateQueries({
                queryKey: releasesQueryKeys.validate(payload.items[0].releaseId),
            });
        }
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<BulkCreateReleaseArtistPayload>
    ) => {
        handleError(data);

        onError?.();
    };
    
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<BulkCreateReleaseArtistPayload>) =>
            releaseArtistApi.bulkCreateReleaseArtist(payload),
        onSuccess,
        onError,
    });

    const bulkCreateReleaseArtist = (
        variables: CreateVariables<BulkCreateReleaseArtistPayload>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        bulkCreateReleaseArtist,
        ...mutation,
    };
};
