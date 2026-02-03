import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';
import { ArtistRoleData } from '../types';
import { UpdateArtistRolePayload } from '../types/payload';

export const useUpdateArtistRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: any,
        {
            onSuccess,
        }: UpdateVariables<ArtistRoleData['id'], UpdateArtistRolePayload>
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
        {
            onError,
        }: UpdateVariables<ArtistRoleData['id'], UpdateArtistRolePayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ArtistRoleData['id'], UpdateArtistRolePayload>) =>
            artistRoleApi.updateArtistRole(id, payload),
        onSuccess,
        onError,
    });

    const updateArtistRole = (
        variables: UpdateVariables<
            ArtistRoleData['id'],
            UpdateArtistRolePayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateArtistRole,
        ...mutation,
    };
};
