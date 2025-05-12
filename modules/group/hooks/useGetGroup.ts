import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api';
import { groupQueryKeys } from '../constants';
import { DataFilterGroup, GroupData, GroupDetail } from '../types/data';

export function useGroupList(params: DataFilterGroup, enabled?: boolean) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...groupQueryKeys.getList, params],
        queryFn: () => groupApi.getList(params),
        placeholderData: (previousData) => previousData,
        enabled: enabled ?? true,
    });

    return {
        ...restResponse,
        dataGroup: data?.data?.data ?? [],
        totalRecord: data?.data?.total ?? 0,
    };
}

export function useGroupListAll(params: DataFilterGroup) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...groupQueryKeys.getListAll, params],
        queryFn: () => groupApi.getListAll(params),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...restResponse,
        dataGroup: data?.data?.data ?? [],
        totalRecord: data?.data?.total ?? 0,
    };
}

export function useGroupDetail(groupId: GroupData['id']) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...groupQueryKeys.getDetail, groupId],
        queryFn: () => groupApi.getDetail(groupId),
        placeholderData: (previousData) => previousData,
        enabled: Boolean(groupId),
    });

    return {
        ...restResponse,
        dataGroupDetail: data?.data?.data ?? ({} as GroupDetail),
    };
}
