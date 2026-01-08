import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseContributorApi } from '../apis';
import { releaseContributorQueryKeys } from '../constants/query-keys';
import { ReleaseContributor } from '../types';
import { UpdateReleaseContributorPayload } from '../types/payload';

export const useUpdateReleaseContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateReleaseContributorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: releaseContributorQueryKeys.lists(),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.details(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<UpdateReleaseContributorPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            ReleaseContributor['id'],
            UpdateReleaseContributorPayload
        >) => releaseContributorApi.update(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseContributor = (
        variables: UpdateVariables<
            ReleaseContributor['id'],
            UpdateReleaseContributorPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateReleaseContributor,
        ...mutation,
    };
};
