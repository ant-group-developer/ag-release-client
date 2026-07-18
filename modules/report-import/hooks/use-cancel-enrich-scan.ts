import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslations } from 'next-intl';
import { reportConfigApis } from '../apis';
import { enrichScanSessionQueryKeys } from '../constants/query-keys';

interface CancelEnrichScanVariables extends CommonFunction {
    scanId: string;
}

export const useCancelEnrichScan = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ scanId }: CancelEnrichScanVariables) =>
            reportConfigApis.cancelEnrichScan(scanId),
        onSuccess: (data, { onSuccess }: CancelEnrichScanVariables) => {
            queryClient.invalidateQueries({
                queryKey: enrichScanSessionQueryKeys.all,
            });
            message.success(
                messages('reportConfigs.enrichDataImport.scanCancelled')
            );
            onSuccess?.(data?.data);
        },
        onError: (error, { onError }: CancelEnrichScanVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        cancelEnrichScan: mutation.mutate,
        ...mutation,
    };
};

export type { CancelEnrichScanVariables };
