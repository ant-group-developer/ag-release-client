import axiosInstance from '@/api/axios-auth';
import { DetailResponse } from '@/types/api';
import {
    ApplyReleaseMergePayload,
    ApplyReleaseMergeResult,
    ReleaseMergeItem,
    ReleaseMergeItemFilter,
    ReleaseMergeList,
    ReleaseMergeRun,
    ReleaseMergeRunFilter,
} from '../types';

const RELEASE_MERGE_API_PATHS = {
    SCANS: '/release-merges/scans',
} as const;

export const releaseMergeApis = {
    createScan: () => {
        return axiosInstance.post<DetailResponse<ReleaseMergeRun>>(
            RELEASE_MERGE_API_PATHS.SCANS
        );
    },

    listScans: (params: ReleaseMergeRunFilter) => {
        return axiosInstance.get<
            DetailResponse<ReleaseMergeList<ReleaseMergeRun>>
        >(RELEASE_MERGE_API_PATHS.SCANS, { params });
    },

    getScan: (scanId: string) => {
        return axiosInstance.get<DetailResponse<ReleaseMergeRun>>(
            `${RELEASE_MERGE_API_PATHS.SCANS}/${scanId}`
        );
    },

    listItems: (scanId: string, params: ReleaseMergeItemFilter) => {
        return axiosInstance.get<
            DetailResponse<ReleaseMergeList<ReleaseMergeItem>>
        >(`${RELEASE_MERGE_API_PATHS.SCANS}/${scanId}/items`, { params });
    },

    getItem: (scanId: string, itemId: string) => {
        return axiosInstance.get<DetailResponse<ReleaseMergeItem>>(
            `${RELEASE_MERGE_API_PATHS.SCANS}/${scanId}/items/${itemId}`
        );
    },

    apply: (scanId: string, payload: ApplyReleaseMergePayload) => {
        return axiosInstance.post<DetailResponse<ApplyReleaseMergeResult>>(
            `${RELEASE_MERGE_API_PATHS.SCANS}/${scanId}/apply`,
            payload
        );
    },
};
