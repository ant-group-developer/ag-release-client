import { DEFAULT_DATA_PAGINATION } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { logApi } from '../apis';
import { logQueryKeys } from '../constants';
import { DataFilterLogs } from '../types/data';

export function useGetLogs(params: DataFilterLogs, enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: logQueryKeys.getLogsList(params),
        queryFn: () => logApi.getListLogs(params),
        placeholderData: (previousData) => previousData,
        enabled: enabled ?? true,
    });

    const logsData = data?.data?.data ?? DEFAULT_DATA_PAGINATION;

    return {
        ...restResponse,
        logsData,
    };
}
