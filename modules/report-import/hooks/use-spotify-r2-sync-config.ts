import { QUERY_KEY } from '@/constants/query-key';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, CreateVariables } from '@/types/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    spotifyExportSchedulerConfigApis,
    spotifyR2SyncConfigApis,
} from '../apis';
import { SpotifyExportSchedulerConfig, SpotifyR2SyncConfig } from '../types';

export const useGetSpotifyR2SyncConfig = () => {
    const { data, ...res } = useQuery({
        queryKey: [QUERY_KEY.SPOTIFY_R2_SYNC_CONFIG.KEY] as const,
        queryFn: () => spotifyR2SyncConfigApis.get(),
    });

    return {
        spotifyR2SyncConfigData: data?.data?.data,
        ...res,
    };
};

export const useUpdateSpotifyR2SyncConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<SpotifyR2SyncConfig>) =>
            spotifyR2SyncConfigApis.update(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<SpotifyR2SyncConfig>
        ) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.SPOTIFY_R2_SYNC_CONFIG.KEY],
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (error, { onError }: CreateVariables<SpotifyR2SyncConfig>) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateSpotifyR2SyncConfig: mutation.mutate,
        ...mutation,
    };
};

export const useSyncSpotifyR2 = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: () => spotifyR2SyncConfigApis.syncR2(),
        onSuccess: (data, { onSuccess }: CommonFunction = {}) => {
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }: CommonFunction = {}) => {
            onError?.(error);
            handleError(error);
        },
    });

    const syncSpotifyR2 = (variables: CommonFunction = {}) => {
        mutation.mutate(variables);
    };

    return {
        syncSpotifyR2,
        ...mutation,
    };
};

export const useGetSpotifyExportSchedulerConfig = () => {
    const { data, ...res } = useQuery({
        queryKey: [QUERY_KEY.SPOTIFY_EXPORT_SCHEDULER_CONFIG.KEY] as const,
        queryFn: () => spotifyExportSchedulerConfigApis.get(),
    });

    return {
        spotifyExportSchedulerConfigData: data?.data?.data,
        ...res,
    };
};

export const useUpdateSpotifyExportSchedulerConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<SpotifyExportSchedulerConfig>) =>
            spotifyExportSchedulerConfigApis.update(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<SpotifyExportSchedulerConfig>
        ) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEY.SPOTIFY_EXPORT_SCHEDULER_CONFIG.KEY],
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<SpotifyExportSchedulerConfig>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateSpotifyExportSchedulerConfig: mutation.mutate,
        ...mutation,
    };
};

export const useExportSpotifyTrigger = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (variables: {
            payload: { force: boolean };
            onSuccess?: (res: any) => void;
            onError?: (err: any) => void;
        }) => spotifyR2SyncConfigApis.exportTrigger(variables.payload),
        onSuccess: (data, variables) => {
            handleSuccess(data?.data);
            variables.onSuccess?.(data?.data);
        },
        onError: (error, variables) => {
            variables.onError?.(error);
            handleError(error);
        },
    });

    return {
        exportSpotifyTrigger: mutation.mutate,
        ...mutation,
    };
};

