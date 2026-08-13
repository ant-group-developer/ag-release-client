import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releasesApi } from '../apis';
import { ReleasesData } from '../types';

export interface TakedownReleaseVariables
    extends DeleteVariables<ReleasesData['id']> {
    code: string[];
}

export const useTakedownRelease = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();

    const onSuccess = (data: any, { onSuccess }: TakedownReleaseVariables) => {
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.lists(),
        });

        handleSuccess(data?.data);
        onSuccess?.();
    };

    const onError = (data: any, { onError }: TakedownReleaseVariables) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ id, code }: TakedownReleaseVariables) =>
            releasesApi.takedownRelease(id, code),
        onSuccess,
        onError,
    });

    const takedownRelease = (variables: TakedownReleaseVariables) => {
        return mutation.mutateAsync(variables);
    };

    return {
        takedownRelease,
        ...mutation,
    };
};
