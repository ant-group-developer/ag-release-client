import { useQuery } from '@tanstack/react-query';
import { batchImportApi } from '../apis';
import { batchImportQueryKeys } from '../constants';
import { BatchImportLogFilter } from '../types/data';

export function useGetBatchImportLogs(
    params: BatchImportLogFilter,
    enabled?: boolean,
) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...batchImportQueryKeys.getLogs, params],
        queryFn: () => batchImportApi.getLogs(params),
        placeholderData: (previousData) => previousData,
        enabled: enabled ?? true,
    });

    return {
        ...restResponse,
        dataLogs: data?.data?.data ?? [],
        totalRecord: data?.data?.total ?? 0,
    };
}
