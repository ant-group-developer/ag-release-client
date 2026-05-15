import { releaseDspQueryKey } from '@/modules/release-dsp/constants/query-keys';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributeApis } from '../apis';
import { DistributeRelease } from '../types/payload';

export const useDistributeRelease = () => {
    const queryClient = useQueryClient();
    // const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (data: DistributeRelease) =>
            distributeApis.distributeRelease(data.id, data.code),
        onSuccess: (data, { onSuccess, id }) => {
            onSuccess?.(data);
            queryClient.invalidateQueries({
                queryKey: releaseDspQueryKey.detail(id, {}),
            });
            queryClient.invalidateQueries({
                queryKey: releasesQueryKeys.detail(id),
            });
            queryClient.invalidateQueries({
                queryKey: releasesQueryKeys.lists(),
            });
            // handleSuccess(data?.data);
        },
        onError: (error, { onError }) => {
            onError?.(error);
            // handleError(error);
        },
    });

    const distributeRelease = (variables: DistributeRelease) => {
        return mutation.mutateAsync(variables);
    };

    return { distributeRelease, ...mutation };
};
