import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { trackApi } from '../apis';
import { TrackData } from '../types';
import { GenerateIsrc } from '../types/payload';

export const useGenerateIsrc = () => {
    // const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<DetailResponse<TrackData>>,
        { onSuccess, trackId }: GenerateIsrc
    ) => {
        onSuccess?.(data?.data?.data);
    };

    const onError = (error: any, { onError }: GenerateIsrc, context: any) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ trackId }: GenerateIsrc) =>
            trackApi.generateIsrc(trackId),
        onSuccess,
        onError,
    });
    const generateIsrc = (variables: GenerateIsrc) => {
        return mutation.mutate(variables);
    };

    return {
        generateIsrc,
        ...mutation,
    };
};
