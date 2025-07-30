import { showNotification } from '@/helpers/messages-helper';
import { releasesQueryKeys } from '@/modules/releases/constants/query-keys';
import { trackQueryKeys } from '@/modules/tracks/constants/query-keys';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { trackArtistApi } from '../apis';
import { CreateTrackArtistPayload } from '../types/payload';

export const useCreateTrackArtist = () => {
    const messages = useTranslations();
    const queryClient = useQueryClient();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<CreateTrackArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: [...trackQueryKeys.getList],
        });
        queryClient.invalidateQueries({
            queryKey: [...releasesQueryKeys.validate],
        });

        // const responseMessages = messages(data?.data?.messageCode);

        onSuccess?.(data?.data?.data);
        // showNotification('success', responseMessages);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateTrackArtistPayload>
    ) => {
        const responseMessages = messages(data?.response?.data?.messageCode);

        onError?.();
        showNotification(
            'error',
            responseMessages || messages('common.somethingWentWrong')
        );
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateTrackArtistPayload>) =>
            trackArtistApi.createTrackArtist(payload),
        onSuccess,
        onError,
    });

    const createTrackArtist = (
        variables: CreateVariables<CreateTrackArtistPayload>
    ) => {
        mutation.mutate(variables);
    };

    return {
        createTrackArtist,
        ...mutation,
    };
};
