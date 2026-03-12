import { useMutation, useQueryClient } from '@tanstack/react-query';
import { distributeApis } from '../apis';
import { DistributeRelease } from '../types/payload';

export const useDistributeRelease = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (data: DistributeRelease) =>
            distributeApis.distributeRelease(data.id, data.code),
        onSuccess: (data, { onSuccess }) => {
            onSuccess?.(data);
        },
        onError: (error, { onError }) => {
            onError?.(error);
        },
    });

    const distributeRelease = (variables: DistributeRelease) => {
        return mutation.mutateAsync(variables);
    };

    return { distributeRelease, ...mutation };
};
