import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { channelApi } from '../apis';
import { channelQueryKeys } from '../constants/query-keys';

export const useRunYoutubeChannelSync = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (payload: { force: boolean }) =>
            channelApi.runYoutubeChannelSync(payload),
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({
                queryKey: channelQueryKeys.youtubeChannelSyncRuns(),
            });
            handleSuccess(data.data);
        },
        onError: handleError,
    });

    return {
        runYoutubeChannelSync: mutation.mutate,
        ...mutation,
    };
};
