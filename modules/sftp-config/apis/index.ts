import axiosInstance from '@/api/axios-auth';
import {
    TestSftpConnectionByIdPayload,
    TestSftpConnectionPayload,
} from '../types/payload';

export const sftpConfigApis = {
    testConnection: (payload: TestSftpConnectionPayload) => {
        return axiosInstance.post<{ status: boolean; latencyMs: number }>(
            '/distribution/sftp-configs/test',
            payload
        );
    },

    testConnectionById: (payload: TestSftpConnectionByIdPayload) => {
        return axiosInstance.post<{ status: boolean; latencyMs: number }>(
            `/distribution/sftp-configs/${payload?.id}/test`,
            payload
        );
    },
};
