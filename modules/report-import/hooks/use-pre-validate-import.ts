import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables, DetailResponse } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { PreValidateImportPayload, PreValidateImportResponse } from '../types/payload';

interface CustomCreateVariables extends Omit<CreateVariables<PreValidateImportPayload>, 'onSuccess'> {
    onSuccess?: (res: DetailResponse<PreValidateImportResponse>) => void;
}

export const usePreValidateImport = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CustomCreateVariables) =>
            reportConfigApis.preValidateImport(payload),
        onSuccess: (
            data,
            { onSuccess }: CustomCreateVariables
        ) => {
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (
            error,
            { onError }: CustomCreateVariables
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        preValidateImport: mutation.mutate,
        ...mutation,
    };
};
