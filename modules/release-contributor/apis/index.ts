import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import { ReleaseContributor } from '../types';
import {
    CreateReleaseContributorPayload,
    UpdateReleaseContributorPayload,
} from '../types/payload';

export const releaseContributorApi = {
    create: (payload: CreateReleaseContributorPayload) => {
        return axiosInstance.post<DetailResponse<ReleaseContributor>>(
            '/release-contributor',
            payload
        );
    },

    update: (
        id: ReleaseContributor['id'],
        payload: UpdateReleaseContributorPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleaseContributor>>(
            `/release-contributor/${id}`,
            payload
        );
    },

    delete: (id: ReleaseContributor['id']) => {
        return axiosInstance.delete(`/release-contributor/${id}`);
    },
};
