import axiosAuth from '@/api/axios-auth';
import { CreateBucketFile } from '../types/data';

export const bucketApi = {
    createBuckets: async (payload: {
        createBucketDtos: CreateBucketFile[];
    }) => {
        const response = await axiosAuth.post(
            '/bucket/gcs/private/bulk',
            payload
        );
        return {
            data: response?.data?.data,
        };
    },
};
