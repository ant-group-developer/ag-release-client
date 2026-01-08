import { useApiNotify } from '@/hooks/use-api-notify';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { trackContributorApi } from '../apis';
import { CreateTrackContributorPayload } from '../types/payload';

export const useCreateTrackContributor = () => {
    // const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackContributorPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.list({
                pageSize: 999,
            }),
        });
        queryClient.invalidateQueries({
            queryKey: trackQueryKeys.detail(data?.data?.data?.trackId),
        });
        queryClient.invalidateQueries({
            queryKey: releasesQueryKeys.validations(),
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTrackContributorPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateTrackContributorPayload>) =>
            trackContributorApi.create(payload),
        onSuccess,
        onError,
    });

    const createTrackContributor = (
        variables: CreateVariables<CreateTrackContributorPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackContributor,
        ...mutation,
    };
};
