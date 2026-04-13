import { exportFileExcel } from '@/helpers/common';
import { useApiNotify } from '@/hooks/use-api-notify';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { releaseExecutionApis } from '../apis';
import { releaseExecutionQueryKeys } from '../constants/query-keys';

export const useBulkDownloadReleaseExecution = () => {
    const { handleError } = useApiNotify();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (ids: string[]) =>
            releaseExecutionApis.downloadManualExport(ids),
        onSuccess: (response) => {
            exportFileExcel(
                new Blob([response.data]),
                `release-export-${new Date().getTime()}.xlsx`
            );

            queryClient.invalidateQueries({
                queryKey: releaseExecutionQueryKeys.getList(),
            });
        },
        onError: (error) => {
            handleError(error);
        },
    });

    const bulkDownload = (ids: string[]) => {
        return mutation.mutateAsync(ids);
    };

    return {
        bulkDownload,
        isPending: mutation.isPending,
    };
};
