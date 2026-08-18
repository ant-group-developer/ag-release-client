import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation } from '@tanstack/react-query';
import { ftpProviderConfigApis } from '../apis';
import {
    TestFtpConnectionPayload,
    TestFtpConnectionResponse,
} from '../types/payload';
import { DetailResponse } from '@/types/api';

export const useTestFtpConnection = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (payload: TestFtpConnectionPayload) =>
            ftpProviderConfigApis.testConnection(payload),
        onSuccess: (data: { data: DetailResponse<TestFtpConnectionResponse> }) => {
            handleSuccess(data?.data);
        },
        onError: (error) => {
            handleError(error);
        },
    });

    return {
        testFtpConnection: mutation.mutateAsync,
        isTesting: mutation.isPending,
        ...mutation,
    };
};
