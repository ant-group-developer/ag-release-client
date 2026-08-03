import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { dspReportQueryKeys } from '@/modules/dsp-report/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspReportApi } from '../apis';

export interface RunFtpReportFileDiscoveryPayload {
    force?: boolean;
    categories?: string[];
}

export const useRunFtpReportFileDiscovery = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: (payload: RunFtpReportFileDiscoveryPayload) =>
            dspReportApi.runFtpReportFileDiscovery(payload),
        onSuccess: async (data: any) => {
            await queryClient.invalidateQueries({
                queryKey: dspReportQueryKeys.ftpReportFileDiscoveryRuns(),
            });
            showNotification(
                'success',
                data?.data?.message || 'Khởi chạy FTP File Discovery thành công!'
            );
        },
        onError: (error: any) => {
            handleError(error);
        },
    });

    return {
        runFtpReportFileDiscovery: mutation.mutate,
        ...mutation,
    };
};
