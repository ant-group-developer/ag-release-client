import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseContributorApi } from '../apis';
import { releaseContributorQueryKeys } from '../constants/query-keys';
import { ReleaseContributor } from '../types';

export const useDeleteReleaseContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: DeleteVariables<ReleaseContributor['id']>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseContributorQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: DeleteVariables<ReleaseContributor['id']>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReleaseContributor['id']>) =>
            releaseContributorApi.delete(id),
        onSuccess,
        onError,
    });

    const deleteReleaseContributor = (
        variables: DeleteVariables<ReleaseContributor['id']>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        deleteReleaseContributor,
        ...mutation,
    };
};
