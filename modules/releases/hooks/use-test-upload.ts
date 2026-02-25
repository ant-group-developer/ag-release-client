import { useApiNotify } from '@/hooks/use-api-notify';
import { DetailResponse, UpdateVariables } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { releasesApi } from '../apis';
import { ReleasesData } from '../types';
import { UpdateReleaseDraftPayload } from '../types/payload';

export const useTestUpload = () => {
    // const messages = useTranslations();
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<DetailResponse<ReleasesData>>,
        {
            onSuccess,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>
    ) => {
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        error: any,
        {
            onError,
            id,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>,
        context: any
    ) => {
        onError?.();
        handleError(error);
    };
    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<ReleasesData['id'], UpdateReleaseDraftPayload>) =>
            releasesApi.testUpload(id),
        onSuccess,
        onError,
    });
    const testUpload = (
        variables: UpdateVariables<
            ReleasesData['id'],
            UpdateReleaseDraftPayload
        >
    ) => {
        return mutation.mutate(variables);
    };

    return {
        testUpload,
        ...mutation,
    };
};
