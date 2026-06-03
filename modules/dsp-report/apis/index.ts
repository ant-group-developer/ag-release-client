import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import { DspReportData, DspReportDataFilter } from '../types';

export const dspReportApi = {
    getList: (params: DspReportDataFilter) => {
        return axiosInstance.get<PaginationResponse<DspReportData>>(
            '/dsps-reports',
            {
                params,
            }
        );
    },
};
