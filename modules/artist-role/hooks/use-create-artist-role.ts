import { showNotification } from '@/helpers/messages-helper';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { artistRoleApi } from '../apis';
import { artistRoleQueryKeys } from '../constants/query-keys';
import { CreateArtistRolePayload } from '../types/payload';

export const useCreateArtistRole = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateArtistRolePayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...artistRoleQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.();
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateArtistRolePayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
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
