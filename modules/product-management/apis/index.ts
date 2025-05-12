import axiosAuth from '@/api/axios-auth';
import { DetailResponse, ListResponse } from '@/types/api';
import { FilterProductManagement, ProductManagementData } from '../types';

export const productManagementApis = {
    getList: (params: FilterProductManagement) => {
        return axiosAuth.get<ListResponse<ProductManagementData>>(
            '/order-product/statistics/analytics-order-product-by-assignee',
            { params }
        );
    },

    exportExcel: async (params: FilterProductManagement): Promise<Blob> => {
        try {
            const result = await axiosAuth.get<DetailResponse<string>>(
                '/order-product/get-link-excel',
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
