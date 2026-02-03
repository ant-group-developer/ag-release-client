import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TimezoneData, TimezoneDataFilter, TimezoneSimpleData } from '../types';
import { CreateTimezonePayload, UpdateTimezonePayload } from '../types/payload';

export const timezoneApi = {
    getList: (params: TimezoneDataFilter) => {
        return axiosInstance.get<PaginationResponse<TimezoneData>>(
            '/timezones',
            {
                params,
            }
        );
    },
    getListSimple: () => {
        return axiosInstance.get<DetailResponse<TimezoneSimpleData[]>>(
            '/timezones/simple'
        );
    },
    getDetail: (id: TimezoneData['id']) => {
        return axiosInstance.get<DetailResponse<TimezoneData>>(
            `/timezones/${id}`
        );
    },
    createTimezone: (payload: CreateTimezonePayload) => {
        return axiosInstance.post<DetailResponse<TimezoneData>>(
            '/timezones',
            payload
        );
    },
    updateTimezone: (
        id: TimezoneData['id'],
        payload: UpdateTimezonePayload
    ) => {
        return axiosInstance.put<DetailResponse<TimezoneData>>(
            `/timezones/${id}`,
            payload
        );
    },
    deleteTimezone: (id: TimezoneData['id']) => {
        return axiosInstance.delete(`/timezones/${id}`);
    },
};
