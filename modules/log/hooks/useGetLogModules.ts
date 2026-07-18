import { useQuery } from '@tanstack/react-query';
import { logApi } from '../apis';
import { logQueryKeys } from '../constants';

export function useGetLogModules(enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: logQueryKeys.getListModules(),
        queryFn: () => logApi.getListModules(),
        enabled: enabled ?? true,
    });

    const modulesData =
        (Array.isArray(data?.data) ? data?.data : (data?.data as any)?.data) ?? [];

    return {
        ...restResponse,
        modulesData: modulesData as string[],
    };
}
