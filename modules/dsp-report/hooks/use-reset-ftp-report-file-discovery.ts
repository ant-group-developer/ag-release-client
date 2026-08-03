import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import { dspReportQueryKeys } from '@/modules/dsp-report/constants/query-keys';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { dspReportApi } from '../apis';

export const useResetFtpReportFileDiscovery = () => {
    const queryClient = useQueryClient();
    const { handleError } = useApiNotify();

    const mutation = useMutation({
        mutationFn: () =>
            dspReportApi.resetFtpReportFileDiscovery({
                confirmation: 'RESET_FTP_DISCOVERY',
                dryRun: false,
            }),
        onSuccess: async (data: any) => {
            await queryClient.invalidateQueries({
                queryKey: dspReportQueryKeys.ftpReportFileDiscoveryRuns(),
            });
            showNotification(
                'success',
                data?.data?.message || 'Reset FTP File Discovery thành công!'
            );
        },
        onError: (error: any) => {
            handleError(error);
        },
    });

    return {
        resetFtpReportFileDiscovery: mutation.mutate,
        ...mutation,
    };
};
