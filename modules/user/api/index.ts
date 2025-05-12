import axiosAccount from '@/api/axios-account';
import axiosAuth from '@/api/axios-auth';
import {
    CommonDataSidebar,
    DetailResponse,
    ListResponse,
    PaginationResponse,
} from '@/types/api';
import {
    DataFilterUser,
    UpdateUserPayload,
    UserData,
    UserDetailData,
} from '../types/data';

export const userApi = {
    getList(params: DataFilterUser) {
        return axiosAuth.get<PaginationResponse<UserData>>('user', {
            params,
        });
    },

    getDetail(id: string) {
        return axiosAuth.get<DetailResponse<UserDetailData>>(`user/${id}`);
    },

    update(payload: UpdateUserPayload) {
        return axiosAccount.patch<DetailResponse<UserDetailData>>(
            'v1/users/me',
            payload
        );
    },

    getCreatorUserList: () => {
        return axiosAuth.get<ListResponse<CommonDataSidebar>>(
            'sidebar/list-user-creator'
        );
    },
};
