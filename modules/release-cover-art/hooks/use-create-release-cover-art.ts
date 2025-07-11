import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseCoverArtApi } from '../apis';
import { ReleaseCoverArtPayload } from '../types';

export const useCreateReleaseCoverArt = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<ReleaseCoverArtPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...releasesQueryKeys.getList],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<ReleaseCoverArtPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<ReleaseCoverArtPayload>) =>
            releaseCoverArtApi.createReleaseCoverArt(payload),
        onSuccess,
        onError,
    });

    const createReleaseCoverArt = (
        variables: CreateVariables<ReleaseCoverArtPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        createReleaseCoverArt,
        ...mutation,
    };
};
