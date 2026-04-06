import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseContributorApi } from '../apis';
import { releaseContributorQueryKeys } from '../constants/query-keys';
import { CreateReleaseContributorPayload } from '../types/payload';

export const useCreateReleaseContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateReleaseContributorPayload>
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
        { onError }: CreateVariables<CreateReleaseContributorPayload>
    ) => {
        handleError(data);

        onError?.();
    };
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateReleaseContributorPayload>) =>
            releaseContributorApi.create(payload),
        onSuccess,
        onError,
    });

    const createReleaseContributor = (
        variables: CreateVariables<CreateReleaseContributorPayload>
    ) => {
        return mutation.mutateAsync(variables);
    };

    return {
        createReleaseContributor,
        ...mutation,
    };
};
