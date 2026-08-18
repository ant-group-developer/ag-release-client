import { useApiNotify } from '@/hooks/use-api-notify';
import { CreateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    reportConfigApis,
    ftpExcludePatternApis,
    ftpProviderConfigApis,
    enrichScanScheduleApis,
} from '../apis';
import {
    reportConfigQueryKeys,
    ftpExcludePatternQueryKeys,
    ftpProviderConfigQueryKeys,
    enrichScanScheduleQueryKeys,
} from '../constants/query-keys';
import {
    CreateReportConfigPayload,
    CreateFtpExcludePatternPayload,
    CreateFtpProviderConfigPayload,
    CreateEnrichScanSchedulePayload,
} from '../types/payload';

export const useCreateReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateReportConfigPayload>) =>
            reportConfigApis.create(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<CreateReportConfigPayload>
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<CreateReportConfigPayload>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        createReportConfig: mutation.mutate,
        ...mutation,
    };
};

export const useCreateFtpExcludePattern = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateFtpExcludePatternPayload>) =>
            ftpExcludePatternApis.create(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<CreateFtpExcludePatternPayload>
        ) => {
            queryClient.invalidateQueries({
                queryKey: ftpExcludePatternQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<CreateFtpExcludePatternPayload>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        createFtpExcludePattern: mutation.mutate,
        ...mutation,
    };
};

export const useCreateEnrichScanSchedule = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateEnrichScanSchedulePayload>) =>
            enrichScanScheduleApis.create(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<CreateEnrichScanSchedulePayload>
        ) => {
            queryClient.invalidateQueries({
                queryKey: enrichScanScheduleQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<CreateEnrichScanSchedulePayload>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        createEnrichScanSchedule: mutation.mutate,
        ...mutation,
    };
};

export const useCreateFtpProviderConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            payload,
        }: CreateVariables<CreateFtpProviderConfigPayload>) =>
            ftpProviderConfigApis.create(payload),
        onSuccess: (
            data,
            { onSuccess }: CreateVariables<CreateFtpProviderConfigPayload>
        ) => {
            queryClient.invalidateQueries({
                queryKey: ftpProviderConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: CreateVariables<CreateFtpProviderConfigPayload>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        createFtpProviderConfig: mutation.mutate,
        ...mutation,
    };
};
