import axiosInstance from '@/api/axios-auth';
import { DetailResponse, PaginationResponse } from '@/types/api';
import {
    ChannelAccessData,
    ChannelDataFilter,
    ChannelsData,
    ChannelsSimpleData,
    UserChannelData,
    YoutubeChannelSyncRun,
    YoutubeChannelSyncRunFilter,
    YoutubeChannelSyncRunLog,
    YoutubeChannelSyncRunLogFilter,
} from '../types';
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

    getListForVideo: (params: ChannelDataFilter) => {
        return axiosInstance.get<PaginationResponse<ChannelsData>>(
            '/channels/video-options',
            {
                params,
            }
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

    getAccess: (channelId: string) => {
        return axiosInstance.get<DetailResponse<ChannelAccessData[]>>(
            `/channels/${channelId}/users`
        );
    },

    addAccess: (channelId: string, payload: { userIds: string[] }) => {
        return axiosInstance.post<DetailResponse<any>>(
            `/channels/${channelId}/users`,
            payload
        );
    },

    removeAccess: (id: string) => {
        return axiosInstance.delete<DetailResponse<any>>(
            `/channels/member/${id}`
        );
    },

    getChannelsByUserId: (userId: string) => {
        return axiosInstance.get<DetailResponse<UserChannelData[]>>(
            `/channels/users/${userId}`
        );
    },

    runYoutubeChannelSync: (payload: { force: boolean }) => {
        return axiosInstance.post<DetailResponse<YoutubeChannelSyncRun>>(
            '/admin/youtube-channel-sync-runs',
            payload
        );
    },

    getYoutubeChannelSyncRuns: (params: YoutubeChannelSyncRunFilter) => {
        return axiosInstance.get<PaginationResponse<YoutubeChannelSyncRun>>(
            '/admin/youtube-channel-sync-runs',
            { params }
        );
    },

    getYoutubeChannelSyncRunLogs: (params: YoutubeChannelSyncRunLogFilter) => {
        return axiosInstance.get<PaginationResponse<YoutubeChannelSyncRunLog>>(
            '/admin/youtube-channel-sync-runs/logs',
            { params }
        );
    },
};
