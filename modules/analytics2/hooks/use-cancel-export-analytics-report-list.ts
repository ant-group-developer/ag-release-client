import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { analytics2Apis } from '../apis';

interface CancelExportAnalyticsReportListVariables extends CommonFunction {
    jobIds: string[];
}

export const useCancelExportAnalyticsReportList = () => {
    const { handleError, handleSuccess } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ jobIds }: CancelExportAnalyticsReportListVariables) =>
            analytics2Apis.cancelExportReportList(jobIds),
        onSuccess: (
            data,
            { onSuccess }: CancelExportAnalyticsReportListVariables
        ) => {
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }: CancelExportAnalyticsReportListVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        cancelExportAnalyticsReportList: mutation.mutate,
        ...mutation,
    };
};

export type { CancelExportAnalyticsReportListVariables };
