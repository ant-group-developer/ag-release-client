import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';

interface CancelExportAnalyticsReportVariables extends CommonFunction {
    jobId: string;
}

export const useCancelExportAnalyticsReport = () => {
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ jobId }: CancelExportAnalyticsReportVariables) =>
            analytics2Apis.cancelExportReport(jobId),
        onSuccess: (data, { onSuccess }: CancelExportAnalyticsReportVariables) => {
            onSuccess?.(data?.data);
            handleSuccess(data?.data);
        },
        onError: (error, { onError }: CancelExportAnalyticsReportVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        cancelExportAnalyticsReport: mutation.mutate,
        ...mutation,
    };
};

export type { CancelExportAnalyticsReportVariables };
