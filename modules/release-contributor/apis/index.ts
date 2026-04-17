import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { ReleaseContributor } from '../types';
import {
    BulkCreateReleaseContributorPayload,
    CreateReleaseContributorPayload,
    UpdateReleaseContributorPayload,
} from '../types/payload';

export const releaseContributorApi = {
    create: (payload: CreateReleaseContributorPayload) => {
        return axiosInstance.post<DetailResponse<ReleaseContributor>>(
            '/release-contributors',
            payload
        );
    },

    bulkCreate: (payload: BulkCreateReleaseContributorPayload) => {
        return axiosInstance.post('/release-contributors/bulk', payload);
    },

    update: (
        id: ReleaseContributor['id'],
        payload: UpdateReleaseContributorPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleaseContributor>>(
            `/release-contributors/${id}`,
            payload
        );
    },

    delete: (id: ReleaseContributor['id']) => {
        return axiosInstance.delete(`/release-contributors/${id}`);
    },
};
