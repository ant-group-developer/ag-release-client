import { useApiNotify } from '@/hooks/use-api-notify';
import { DeleteVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis, ftpExcludePatternApis, enrichScanScheduleApis } from '../apis';
import { reportConfigQueryKeys, ftpExcludePatternQueryKeys, enrichScanScheduleQueryKeys } from '../constants/query-keys';
import { ReportConfigData, FtpExcludePatternData, EnrichScanScheduleData } from '../types';

export const useDeleteReportConfig = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<ReportConfigData['id']>) =>
            reportConfigApis.delete(id),
        onSuccess: (
            data,
            { onSuccess }: DeleteVariables<ReportConfigData['id']>
        ) => {
            queryClient.invalidateQueries({
                queryKey: reportConfigQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: DeleteVariables<ReportConfigData['id']>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteReportConfig: mutation.mutate,
        ...mutation,
    };
};

export const useDeleteFtpExcludePattern = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<FtpExcludePatternData['id']>) =>
            ftpExcludePatternApis.delete(id),
        onSuccess: (
            data,
            { onSuccess }: DeleteVariables<FtpExcludePatternData['id']>
        ) => {
            queryClient.invalidateQueries({
                queryKey: ftpExcludePatternQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: DeleteVariables<FtpExcludePatternData['id']>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteFtpExcludePattern: mutation.mutate,
        ...mutation,
    };
};

export const useDeleteEnrichScanSchedule = () => {
    const queryClient = useQueryClient();
    const { handleSuccess, handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ id }: DeleteVariables<EnrichScanScheduleData['id']>) =>
            enrichScanScheduleApis.delete(id),
        onSuccess: (
            data,
            { onSuccess }: DeleteVariables<EnrichScanScheduleData['id']>
        ) => {
            queryClient.invalidateQueries({
                queryKey: enrichScanScheduleQueryKeys.lists(),
            });
            handleSuccess(data?.data);
            onSuccess?.();
        },
        onError: (
            error,
            { onError }: DeleteVariables<EnrichScanScheduleData['id']>
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        deleteEnrichScanSchedule: mutation.mutate,
        ...mutation,
    };
};
