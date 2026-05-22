import axiosInstance from '@/api/axios-auth';
import { ListResponse } from '@/types/api';
import { TenantDspData, TenantDspDataFilter } from '../types';
import { UpdateTenantDspPayload } from '../types/payload';

export const tenantDspApi = {
    getList: (params: TenantDspDataFilter) => {
        return axiosInstance.get<ListResponse<TenantDspData>>(
            '/tenant-dsp-agreements/tenant/dsps',
            {
                params,
            }
        );
    },

    update: (dspId: string, payload: UpdateTenantDspPayload) => {
        return axiosInstance.put(
            `/tenant-dsp-agreements/tenant/dsps/${dspId}`,
            payload
        );
    },
};
