// import { useQuery } from '@tanstack/react-query';
// import { userApi } from '../api';
// import { userQueryKeys } from '../constants';
// import { DataFilterUser, UserData } from '../types';

import { defaultDataPagination } from '@/constants/common';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '../api';
import { userQueryKeys } from '../constants';
import { DataFilterUser, UserDetailData } from '../types/data';

export function useUserList(params: DataFilterUser) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...userQueryKeys.getList, params],
        queryFn: () => userApi.getList(params),
        placeholderData: (previousData) => previousData,
    });

    return {
        ...restResponse,
        data: data?.data?.data ?? defaultDataPagination,
    };
}

export function useUserDetail(id: string | null) {
    const { data, ...restResponse } = useQuery({
        queryKey: [...userQueryKeys.getDetail, id],
        queryFn: () => userApi.getDetail(id as string),
        placeholderData: (previousData) => previousData,
        enabled: Boolean(id),
    });

    return {
        ...restResponse,
        dataUser: data?.data?.data ?? ({} as UserDetailData),
    };
}
