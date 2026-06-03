import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { ChannelDataFilter, ChannelsData, ChannelsSimpleData } from '../types';
import { CreateChannelPayload, UpdateChannelPayload } from '../types/payload';

export const channelApi = {
    getList: (params: ChannelDataFilter) => {
        return axiosInstance.get<PaginationResponse<ChannelsData>>(
            '/channels',
            {
                params,
            }
        );
    },

    getListSimple: () => {
        return axiosInstance.get<DetailResponse<ChannelsSimpleData[]>>(
            '/channels/simple'
        );
    },

    getDetail: (id: ChannelsData['id']) => {
        return axiosInstance.get<DetailResponse<ChannelsData>>(
            `/channels/${id}`
        );
    },

    createChannel: (payload: CreateChannelPayload) => {
        return axiosInstance.post<DetailResponse<ChannelsData>>(
            '/channels',
            payload
        );
    },

    updateChannel: (id: ChannelsData['id'], payload: UpdateChannelPayload) => {
        return axiosInstance.put(`/channels/${id}`, payload);
    },

    deleteChannel: (id: ChannelsData['id']) => {
        return axiosInstance.delete(`/channels/${id}`);
    },
};
