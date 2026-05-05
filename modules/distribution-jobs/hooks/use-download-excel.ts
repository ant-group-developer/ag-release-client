import { exportFileExcel } from '@/helpers/common';
import { useApiNotify } from '@/hooks/use-api-notify';
import { CommonFunction } from '@/types/api';
import { useMutation } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { distributionJobApis } from '../apis';

export const useDownloadExcelDistributionJobs = () => {
    const { handleError } = useApiNotify();

    const onSuccess = (
        data: AxiosResponse<Blob, any>,
        { onSuccess }: CommonFunction & { ids: any[] }
    ) => {
        exportFileExcel(
            data.data,
            `distribution-jobs-${new Date().getTime()}.xlsx`
        );
        onSuccess?.(data?.data);
    };

    const onError = async (
        data: any,
        { onError }: CommonFunction & { ids: any[] }
    ) => {
        onError?.();
        if (data?.response?.data instanceof Blob) {
            try {
                const text = await data.response.data.text();
                const errorData = JSON.parse(text);
                data.response.data = errorData;
                handleError(data);
            } catch {
                handleError(data);
            }
        } else {
            handleError(data);
        }
    };

    const mutation = useMutation({
        mutationFn: ({ ids }: { ids: any[] } & CommonFunction) =>
            distributionJobApis.downloadExcel(ids),
        onSuccess,
        onError,
    });

    const downloadExcel = (variables: { ids: any[] } & CommonFunction) => {
        mutation.mutate(variables);
    };

    return {
        downloadExcel,
        ...mutation,
    };
};
