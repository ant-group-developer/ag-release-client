import axiosAuth from '@/api/axios-auth';
import { DetailResponse, ListResponse } from '@/types/api';
import { ParamsExportExcelStatisticOrder } from '../hooks/use-export-excel-statistic-order';
import { GroupCount, LineChartData, StatisticCommonParams } from '../types';
import {
    FilterOrderStatistic,
    OrderStatusCount,
} from '../types/order-statistic';
import { ProductStatusCount } from '../types/product-statistic';
import { TopUserData, TopUserFilter } from '../types/user-statistic';

export const statisticApis = {
    getOrdersStatus: ({
        type,
        typeSelect,
        ...params
    }: FilterOrderStatistic) => {
        return axiosAuth.get<DetailResponse<OrderStatusCount>>(
            '/orders/statistics',
            { params }
        );
    },

    getProductStatus: ({
        type,
        typeSelect,
        ...params
    }: FilterOrderStatistic) => {
        return axiosAuth.get<DetailResponse<ProductStatusCount>>(
            '/order-product/statistics',
            { params }
        );
    },

    getProductGraphData: ({ typeSelect, ...params }: FilterOrderStatistic) => {
        return axiosAuth.get<DetailResponse<LineChartData[]>>(
            `/order-product/statistics/count-order-product`,
            { params }
        );
    },

    getOrderGraphData: ({ typeSelect, ...params }: FilterOrderStatistic) => {
        return axiosAuth.get<DetailResponse<LineChartData[]>>(
            `/orders/statistics/count-order`,
            { params }
        );
    },

    getTopUserCreators: (params: TopUserFilter) => {
        return axiosAuth.get<ListResponse<TopUserData>>(
            `/orders/statistics/top-order-creators`,
            {
                params,
            }
        );
    },

    getTopUserCompleted: (params: TopUserFilter) => {
        return axiosAuth.get<ListResponse<TopUserData>>(
            `/order-product/statistics/top-order-product-creators-completed`,
            {
                params,
            }
        );
    },

    getOrderGroupCount: (params: StatisticCommonParams) => {
        return axiosAuth.get<ListResponse<GroupCount>>(
            `/orders/statistics/analytics-order-by-group-ids`,
            { params }
        );
    },

    getOrderProductGroupCount: (params: StatisticCommonParams) => {
        return axiosAuth.get<ListResponse<GroupCount>>(
            `/order-product/statistics/analytics-order-product-by-group-ids`,
            { params }
        );
    },

    exportExcel: async (
        params: ParamsExportExcelStatisticOrder
    ): Promise<Blob> => {
        try {
            const result = await axiosAuth.get<DetailResponse<string>>(
                '/orders/get-link-excel-order-by-groups',
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
