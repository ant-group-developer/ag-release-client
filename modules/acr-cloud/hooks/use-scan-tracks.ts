import { useApiError } from '@/hooks/use-api-error';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acrCloudApis } from '../apis';
import { acrCloudQueryKeys } from '../constants/query-keys';
import { ScanTracksPayload } from '../types/payloads';

export const useScanTracks = () => {
    const { handleError } = useApiError();
    const queryClient = useQueryClient();
    const onSuccess = (data: any, { onSuccess }: ScanTracksPayload) => {
        onSuccess?.();
        queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
        queryClient.invalidateQueries({
            queryKey: acrCloudQueryKeys.getScanStatusLists(),
        });
    };

    const onError = (error: any, { onError }: ScanTracksPayload) => {
        handleError(error);
        onError?.(error);
    };
    const mutation = useMutation({
        mutationFn: ({ filter }: ScanTracksPayload) =>
            acrCloudApis.scanTracks(filter),
        onError,
        onSuccess,
    });

    const scanTracks = (variable: ScanTracksPayload) => {
        mutation.mutate(variable);
    };

    return {
        scanTracks,
        ...mutation,
    };
};
