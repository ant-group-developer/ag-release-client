import axiosAuth from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { TimezoneData, TimezoneDataFilter } from '../types';
import { CreateTimezonePayload, UpdateTimezonePayload } from '../types/payload';

export const timezoneApi = {
    getList: (params: TimezoneDataFilter) => {
        return axiosAuth.get<PaginationResponse<TimezoneData>>('/timezones', {
            params,
        });
    },
    getDetail: (id: TimezoneData['id']) => {
        return axiosAuth.get<DetailResponse<TimezoneData>>(`/timezones/${id}`);
    },
    createTimezone: (payload: CreateTimezonePayload) => {
        return axiosAuth.post<DetailResponse<TimezoneData>>(
            '/timezones',
            payload
        );
    },
    updateTimezone: (
        id: TimezoneData['id'],
        payload: UpdateTimezonePayload
    ) => {
        return axiosAuth.put<DetailResponse<TimezoneData>>(
            `/timezones/${id}`,
            payload
        );
    },
    deleteTimezone: (id: TimezoneData['id']) => {
        return axiosAuth.delete(`/timezones/${id}`);
    },
};
