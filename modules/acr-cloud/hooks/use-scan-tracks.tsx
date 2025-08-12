import { useApiError } from '@/hooks/use-api-error';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { TrackData } from '@/modules/tracks/types';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { acrCloudApis } from '../apis';

export interface ScanTracksPayload extends CommonFunction {
    filter: {
        tracksIds: TrackData['id'][];
        trackCreatedAtStart: string;
        trackCreatedAtEnd: string;
        ignoreTrackScanned: boolean;
    };
}

export const useScanTracks = () => {
    const { handleError } = useApiError();
    const queryClient = useQueryClient();
    const onSuccess = (data: any, { onSuccess }: ScanTracksPayload) => {
        onSuccess?.();
        queryClient.invalidateQueries({ queryKey: trackQueryKeys.lists() });
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
