import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { ExportReportRequest } from '../types';

interface ExportAnalyticsReportVariables extends CommonFunction {
    payload: ExportReportRequest;
}

export const useExportAnalyticsReport = () => {
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: ExportAnalyticsReportVariables) =>
            analytics2Apis.exportReport(payload),
        onSuccess: (data, { onSuccess }: ExportAnalyticsReportVariables) => {
            onSuccess?.(data?.data);
            // handleSuccess(data?.data);
        },
        onError: (error, { onError }: ExportAnalyticsReportVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        exportAnalyticsReport: mutation.mutate,
        ...mutation,
    };
};

export type { ExportAnalyticsReportVariables };
