import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction, DetailResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { AxiosResponse } from 'axios';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';

export const useSyncArtistProfileName = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();
    const onSuccess = (
        data: AxiosResponse<DetailResponse<any>, any>,
        { onSuccess }: CommonFunction
    ) => {
        queryClient.invalidateQueries({
            queryKey: artistQueryKeys.lists(),
        });
        onSuccess?.(data?.data?.data);
        showNotification(
            'success',
            messages('artist.message.success.syncProfileName')
        );
    };

    const onError = (data: any, { onError }: CommonFunction) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: () => artistApi.syncArtistProfileName(),
        onSuccess,
        onError,
    });

    const syncArtistProfileName = (variables?: CommonFunction) => {
        mutation.mutate(variables || {});
    };

    return {
        syncArtistProfileName,
        ...mutation,
    };
};
