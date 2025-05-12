import { useQuery } from '@tanstack/react-query';
import { logApi } from '../apis';
import { logQueryKeys } from '../constants';
import { DataFilterLog } from '../types/data';

export function useLogList(params: DataFilterLog, enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...logQueryKeys.getList, params],
        queryFn: () => logApi.getList(params),
        placeholderData: (previousData) => previousData,
        enabled: enabled ?? true,
    });

    return {
        ...restResponse,
        dataLog: data?.data?.data ?? [],
        totalRecord: data?.data?.total ?? 0,
    };
}
