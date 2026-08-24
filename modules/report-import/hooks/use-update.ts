import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
    reportConfigApis,
    ftpExcludePatternApis,
    ftpProviderConfigApis,
    enrichScanScheduleApis,
    sourceTypeConfigApis,
} from '../apis';
import {
    reportConfigQueryKeys,
    ftpExcludePatternQueryKeys,
    ftpProviderConfigQueryKeys,
    enrichScanScheduleQueryKeys,
    sourceTypeConfigQueryKeys,
} from '../constants/query-keys';
import {
    ReportConfigData,
    FtpExcludePatternData,
    FtpProviderConfigData,
    EnrichScanScheduleData,
} from '../types';
import {
    UpdateReportConfigPayload,
    UpdateFtpExcludePatternPayload,
    UpdateFtpProviderConfigPayload,
    UpdateEnrichScanSchedulePayload,
    UpdateSourceTypeConfigPayload,
} from '../types/payload';

export const useUpdateReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationKey: reportConfigQueryKeys.update(),
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            ReportConfigData['id'],
            UpdateReportConfigPayload
        >) => reportConfigApis.update(id, payload),
        onSuccess: (
            data,
            {
                id,
                onSuccess,
            }: UpdateVariables<
                ReportConfigData['id'],
                UpdateReportConfigPayload
            >
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.detail(id),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: UpdateVariables<
                ReportConfigData['id'],
                UpdateReportConfigPayload
            >
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateReportConfig: mutation.mutate,
        ...mutation,
    };
};

export const useUpdateFtpExcludePattern = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            FtpExcludePatternData['id'],
            UpdateFtpExcludePatternPayload
        >) => ftpExcludePatternApis.update(id, payload),
        onSuccess: (
            data,
            {
                id,
                onSuccess,
            }: UpdateVariables<
                FtpExcludePatternData['id'],
                UpdateFtpExcludePatternPayload
            >
        ) => {
            queryClient.invalidateQueries({
                queryKey: ftpExcludePatternQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ftpExcludePatternQueryKeys.detail(id),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: UpdateVariables<
                FtpExcludePatternData['id'],
                UpdateFtpExcludePatternPayload
            >
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateFtpExcludePattern: mutation.mutate,
        ...mutation,
    };
};

export const useUpdateEnrichScanSchedule = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            EnrichScanScheduleData['id'],
            UpdateEnrichScanSchedulePayload
        >) => enrichScanScheduleApis.update(id, payload),
        onSuccess: (
            data,
            {
                onSuccess,
            }: UpdateVariables<
                EnrichScanScheduleData['id'],
                UpdateEnrichScanSchedulePayload
            >
        ) => {
            queryClient.invalidateQueries({
                queryKey: enrichScanScheduleQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: UpdateVariables<
                EnrichScanScheduleData['id'],
                UpdateEnrichScanSchedulePayload
            >
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateEnrichScanSchedule: mutation.mutate,
        ...mutation,
    };
};

export const useUpdateSourceTypeConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            sourceType,
            payload,
        }: {
            sourceType: string;
            payload: UpdateSourceTypeConfigPayload;
            onSuccess?: () => void;
            onError?: () => void;
        }) => sourceTypeConfigApis.update(sourceType, payload),
        onSuccess: (data, { onSuccess }) => {
            queryClient.invalidateQueries({
                queryKey: sourceTypeConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (error, { onError }) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateSourceTypeConfig: mutation.mutate,
        ...mutation,
    };
};

export const useUpdateFtpProviderConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({
            id,
            payload,
        }: UpdateVariables<
            FtpProviderConfigData['id'],
            UpdateFtpProviderConfigPayload
        >) => ftpProviderConfigApis.update(id, payload),
        onSuccess: (
            data,
            {
                id,
                onSuccess,
            }: UpdateVariables<
                FtpProviderConfigData['id'],
                UpdateFtpProviderConfigPayload
            >
        ) => {
            queryClient.invalidateQueries({
                queryKey: ftpProviderConfigQueryKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: ftpProviderConfigQueryKeys.detail(id),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: UpdateVariables<
                FtpProviderConfigData['id'],
                UpdateFtpProviderConfigPayload
            >
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        updateFtpProviderConfig: mutation.mutate,
        ...mutation,
    };
};

