import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { sftpConfigApis } from '../apis';
import {
    TestSftpConnectionByIdPayload,
    TestSftpConnectionPayload,
} from '../types/payload';

export const useTestConnection = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<TestSftpConnectionPayload>
    ) => {
        // handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<TestSftpConnectionPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({ payload }: CreateVariables<TestSftpConnectionPayload>) =>
            sftpConfigApis.testConnection(payload),
        onSuccess,
        onError,
    });
    const testConnection = (
        variables: CreateVariables<TestSftpConnectionPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        testConnection,
        ...mutation,
    };
};

export const useTestConnectionById = () => {
    const { handleSuccess, handleError } = useApiNotify();

    const onSuccess = (
        data: any,
        { onSuccess }: CreateVariables<TestSftpConnectionByIdPayload>
    ) => {
        // handleSuccess(data?.data);
        onSuccess?.(data?.data?.data);
    };

    const onError = (
        data: any,
        { onError }: CreateVariables<TestSftpConnectionByIdPayload>
    ) => {
        onError?.();
        handleError(data);
    };
    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<TestSftpConnectionByIdPayload>) =>
            sftpConfigApis.testConnectionById(payload),
        onSuccess,
        onError,
    });
    const testConnectionById = (
        variables: CreateVariables<TestSftpConnectionByIdPayload>
    ) => {
        return mutation.mutate(variables);
    };

    return {
        testConnectionById,
        ...mutation,
    };
};
