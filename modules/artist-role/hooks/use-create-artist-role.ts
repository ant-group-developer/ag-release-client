import { showNotification } from '@/helpers/messages-helper';
import { useApiError } from '@/hooks/use-api-error';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';
import { CreateArtistRolePayload } from '../types/payload';

export const useCreateArtistRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiError();
    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateArtistRolePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: artistRoleQueryKeys.list(),
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateArtistRolePayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateArtistRolePayload>) =>
            artistRoleApi.createArtistRole(payload),
        onSuccess,
        onError,
    });

    const createArtistRole = (
        variables: CreateVariables<CreateArtistRolePayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createArtistRole,
        ...mutation,
    };
};
