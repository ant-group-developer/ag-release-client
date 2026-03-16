import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { releasesApi } from '../apis';
import { ReleasesData } from '../types';
import { GenerateUpc } from '../types/payload';

export const useGenerateUpc = () => {
    // const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<DetailResponse<ReleasesData>>,
        { onSuccess, releaseId }: GenerateUpc
    ) => {
        onSuccess?.(data?.data?.data);
    };

    const onError = (error: any, { onError }: GenerateUpc, context: any) => {
        onError?.();
        handleError(error);
    };

    const mutation = useMutation({
        mutationFn: ({ releaseId }: GenerateUpc) =>
            releasesApi.generateUpc(releaseId),
        onSuccess,
        onError,
    });
    const generateUpc = (variables: GenerateUpc) => {
        return mutation.mutate(variables);
    };

    return {
        generateUpc,
        ...mutation,
    };
};
