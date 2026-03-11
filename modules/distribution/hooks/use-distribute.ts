import { releaseDspQueryKey } from '@/modules/release-dsp/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributeApis } from '../apis';
import { DistributeRelease } from '../types/payload';

export const useDistributeRelease = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: DistributeRelease) =>
            distributeApis.distributeRelease(data.id, data.code),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: releaseDspQueryKey.detail(data.data?.data?.id ?? ''),
            });
        },
    });

    const distributeRelease = (variables: DistributeRelease) => {
        return mutation.mutateAsync(variables);
    };

    return { distributeRelease, ...mutation };
};
