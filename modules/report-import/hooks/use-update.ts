import { useApiNotify } from '@/hooks/use-api-notify';
import { UpdateVariables } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { reportConfigApis, ftpExcludePatternApis } from '../apis';
import { reportConfigQueryKeys, ftpExcludePatternQueryKeys } from '../constants/query-keys';
import { ReportConfigData, FtpExcludePatternData } from '../types';
import { UpdateReportConfigPayload, UpdateFtpExcludePatternPayload } from '../types/payload';

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
