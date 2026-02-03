import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { IssueData, IssueDataFilter } from '../types';
import { CreateIssuePayload, UpdateIssuePayload } from '../types/payloads';

export const issuesApis = {
    getList: (params: IssueDataFilter) => {
        return axiosInstance.get<PaginationResponse<IssueData>>('/issues', {
            params,
        });
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<IssueData[]>>('/issues/simple');
    },

    getDetail: (id: IssueData['id']) => {
        return axiosInstance.get<DetailResponse<IssueData>>(`/issues/${id}`);
    },

    create: (payload: CreateIssuePayload) => {
        return axiosInstance.post<DetailResponse<IssueData>>(
            '/issues',
            payload
        );
    },

    update: (id: IssueData['id'], payload: UpdateIssuePayload) => {
        return axiosInstance.put<DetailResponse<IssueData>>(
            `issues/${id}`,
            payload
        );
    },

    delete: (id: IssueData['id']) => {
        return axiosInstance.delete(`/issues/${id}`);
    },
};
