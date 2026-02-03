import axiosInstance from '@/api/axios-auth';
import { DetailResponse, ListResponse } from '@/types/api';
import { DataFilterGroup, GroupData, GroupDetail } from '../types/data';

export const groupApi = {
    getList(params: DataFilterGroup) {
        return axiosInstance.get<ListResponse<GroupData>>('/group', {
            params,
        });
    },

    getListAll(params: DataFilterGroup) {
        return axiosInstance.get<ListResponse<GroupData>>('/group', {
            params,
        });
    },

    getDetail(groupId: GroupData['id']) {
        return axiosInstance.get<DetailResponse<GroupDetail>>(
            `/group/${groupId}`
        );
    },
};
