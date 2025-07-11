import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { releaseArtistApi } from '../apis';
import { releaseArtistQueryKeys } from '../constants/query-keys';
import { ReleaseArtist } from '../types';
import { UpdateReleaseArtistPayload } from '../types/payload';

export const useUpdateReleaseArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<UpdateReleaseArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...releaseArtistQueryKeys.getList],
        });
        queryClient.invalidateQueries({
            queryKey: [...releasesQueryKeys.getDetail],
        });

        const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<UpdateReleaseArtistPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleaseArtist['id'], UpdateReleaseArtistPayload>) =>
            releaseArtistApi.updateReleaseArtist(id, payload),
        onSuccess,
        onError,
    });

    const updateReleaseArtist = (
        variables: UpdateVariables<
            ReleaseArtist['id'],
            UpdateReleaseArtistPayload
        >
    ) => {
        mutation.mutate(variables);
    };

    return {
        updateReleaseArtist,
        ...mutation,
    };
};
