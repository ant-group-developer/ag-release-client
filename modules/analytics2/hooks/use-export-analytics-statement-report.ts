import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';
import { ExportReportRequest } from '../types';

interface ExportAnalyticsStatementReportVariables extends CommonFunction {
    payload: ExportReportRequest;
}

export const useExportAnalyticsStatementReport = () => {
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: ExportAnalyticsStatementReportVariables) =>
            analytics2Apis.exportStatementReport(payload),
        onSuccess: (
            data,
            { onSuccess }: ExportAnalyticsStatementReportVariables
        ) => {
            onSuccess?.(data?.data);
        },
        onError: (
            error,
            { onError }: ExportAnalyticsStatementReportVariables
        ) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        exportAnalyticsStatementReport: mutation.mutate,
        ...mutation,
    };
};

export type { ExportAnalyticsStatementReportVariables };
