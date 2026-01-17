import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { IntegrationData, IntegrationDataFilter } from '../types';
import { UpdateIntegrationPayload } from '../types/payload';

export const integrationApis = {
    getList: (params: IntegrationDataFilter) => {
        return axiosInstance.get<PaginationResponse<IntegrationData>>(
            '/tenant-integrations',
            { params }
        );
    },
    getDetail: (id: IntegrationData['id']) => {
        return axiosInstance.get<DetailResponse<IntegrationData>>(
            `/tenant-integrations/${id}`
        );
    },
    update: (id: IntegrationData['id'], payload: UpdateIntegrationPayload) => {
        return axiosInstance.put<DetailResponse<IntegrationData>>(
            `/tenant-integrations/${id}`,
            payload
        );
    },
};
