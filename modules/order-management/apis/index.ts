import axiosAuth from '@/api/axios-auth';
import { DetailResponse, ListResponse } from '@/types/api';
import { FilterOrderManagement, OrderManagementData } from '../types';

export const orderManagementApis = {
    getList: (params: FilterOrderManagement) => {
        return axiosAuth.get<ListResponse<OrderManagementData>>(
            '/orders/statistics/analytics-order-by-user-creator',
            { params }
        );
    },

    exportExcel: async (params: FilterOrderManagement): Promise<Blob> => {
        try {
            const result = await axiosAuth.get<DetailResponse<string>>(
                '/orders/get-link-excel',
                { params }
            );
            const { statusCode, data } = result?.data;

            if (statusCode !== 200 || !data) {
                throw new Error('Get link excel failed');
            }

            const downloadPath = `/download/${data}`;
            const { data: excelBlob } = await axiosAuth.get<Blob>(
                downloadPath,
                {
                    responseType: 'blob',
                }
            );
            return excelBlob;
        } catch (error) {
            console.error('[exportExcel] Error:', error);
            throw error;
        }
    },
};
