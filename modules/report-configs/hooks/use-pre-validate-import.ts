import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { reportConfigApis } from '../apis';
import { PreValidateImportPayload } from '../types/payload';

export const usePreValidateImport = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<PreValidateImportPayload>) =>
            reportConfigApis.preValidateImport(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<PreValidateImportPayload>
        ) => {
            handleSuccess(data?.data);
            onSuccess?.(data?.data);
        },
        onError: (
            error,
            { onError }: CreateVariables<PreValidateImportPayload>
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
