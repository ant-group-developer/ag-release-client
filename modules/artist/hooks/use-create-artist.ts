import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables, DetailResponse } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { artistApi } from '../apis';
import { artistQueryKeys } from '../constants/query-keys';
import { ArtistData } from '../types';
import { CreateArtistPayload } from '../types/payload';

export const useCreateArtist = () => {
    const queryClient = useQueryClient();
    const { handleError, handleSuccess } = useApiNotify();
    const onSuccess = (
        data: AxiosResponse<DetailResponse<ArtistData>, any>,
        { onSuccess }: CreateVariables<CreateArtistPayload>
    ) => {
        queryClient.invalidateQueries({
            queryKey: artistQueryKeys.lists(),
        });
        onSuccess?.(data?.data?.data);
        handleSuccess(data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<CreateArtistPayload>
    ) => {
        onError?.();
        handleError(data);
    };

    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<CreateArtistPayload>) =>
            artistApi.createArtist(payload),
        onSuccess,
        onError,
    });

    const createArtist = (variables: CreateVariables<CreateArtistPayload>) => {
        mutation.mutate(variables);
    };

    return {
        createArtist,
        ...mutation,
    };
};
