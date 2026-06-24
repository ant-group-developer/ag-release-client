import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useTranslations } from 'next-intl';
import { reportConfigApis } from '../apis';
import { enrichScanSessionQueryKeys } from '../constants/query-keys';
import { StartEnrichScanPayload } from '../types/payload';

interface StartEnrichScanVariables extends CommonFunction {
    payload: StartEnrichScanPayload;
}

export const useStartEnrichScan = () => {
    const queryClient = useQueryClient();
    const messages = useTranslations();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: ({ payload }: StartEnrichScanVariables) =>
            reportConfigApis.startEnrichScan(payload),
        onSuccess: (data, { onSuccess }: StartEnrichScanVariables) => {
            queryClient.invalidateQueries({
                queryKey: enrichScanSessionQueryKeys.all,
            });
            message.success(
                messages('reportConfigs.enrichDataImport.scanStarted')
            );
            onSuccess?.(data?.data?.data);
        },
        onError: (error, { onError }: StartEnrichScanVariables) => {
            onError?.();
            handleError(error);
        },
    });

    return {
        startEnrichScan: mutation.mutate,
        ...mutation,
    };
};

export type { StartEnrichScanVariables };
