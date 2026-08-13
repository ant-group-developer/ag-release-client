import axiosInstance from '@/api/axios-auth';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { Key } from 'react';
import {
    ReleaseCaptionData,
    ReleaseEnrichedError,
    ReleaseEnrichedErrorFilter,
    ReleaseReview,
    ReleaseReviewFilter,
    ReleasesData,
    ReleasesDataFilter,
    ReleasesDataSimple,
    ReleaseValidate,
} from '../types';
import {
    AutoSubmitUndistributedMusicRelease,
    BulkCreateReleaseErrorsPayload,
    BulkSubmitRelease,
    BulkUpdateReleaseErrorsPayload,
    CreateReleaseDraftPayload,
    ExportTemplateCi,
    SyncReleaseDraftToTracksPayload,
    UpdateReleaseCaptionPayload,
    UpdateReleaseDraftPayload,
    UpdateReleaseReviewDecisionPayload,
    UpsertReleaseCaptionsPayload,
} from '../types/payload';

const RELEASE_ENRICHED_ERRORS_API_PATH = '/release-errors/enriched';
const RELEASE_ERRORS_BULK_API_PATH = '/release-errors/bulk';

export const releasesApi = {
    getList: (params: ReleasesDataFilter) => {
        return axiosInstance.post<PaginationResponse<ReleasesData>>(
            '/releases/get-list',
            params
        );
    },

    getListSimple: (params: ReleasesDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleasesDataSimple>>(
            '/releases/simple',
            {
                params,
            }
        );
    },

    getDetail: (id: ReleasesData['id']) => {
        return axiosInstance.get<DetailResponse<ReleasesData>>(
            `/releases/${id}`
        );
    },

    createReleaseDraft: (payload: CreateReleaseDraftPayload) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            '/releases/draft',
            payload
        );
    },

    updateReleaseDraft: (
        id: ReleasesData['id'],
        payload: UpdateReleaseDraftPayload
    ) => {
        return axiosInstance.put<DetailResponse<ReleasesData>>(
            `/releases/draft/${id}`,
            payload
        );
    },

    testUploadSpotify: (id: ReleasesData['id']) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            `/releases/${id}/create-and-upload-metadata-spotify`
        );
    },

    testUploadCi: (id: ReleasesData['id']) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            `/releases/${id}/create-and-upload-metadata-ci`
        );
    },

    deleteRelease: (id: ReleasesData['id']) => {
        return axiosInstance.delete(`/releases/draft/${id}`);
    },

    validate: (id: ReleasesData['id']) => {
        {
            return axiosInstance.get<DetailResponse<ReleaseValidate[]>>(
                `/releases/draft/${id}/validate`
            );
        }
    },

    getEnrichedErrors: (params: ReleaseEnrichedErrorFilter) => {
        return axiosInstance.get<DetailResponse<ReleaseEnrichedError[]>>(
            RELEASE_ENRICHED_ERRORS_API_PATH,
            {
                params,
            }
        );
    },

    bulkUpdateReleaseErrors: (payload: BulkUpdateReleaseErrorsPayload) => {
        return axiosInstance.put(RELEASE_ERRORS_BULK_API_PATH, payload);
    },

    bulkCreateReleaseErrors: (payload: BulkCreateReleaseErrorsPayload) => {
        return axiosInstance.post(RELEASE_ERRORS_BULK_API_PATH, payload);
    },

    updateReleaseReviewDecision: (
        id: ReleasesData['id'],
        payload: UpdateReleaseReviewDecisionPayload
    ) => {
        return axiosInstance.post(`/releases/${id}/release-review`, payload);
    },

    downloadAssets: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/assets`, {
            responseType: 'blob',
        });
    },

    downloadCoverArt: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/cover-art`, {
            responseType: 'blob',
        });
    },

    downloadCsvMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/csv-metadata`, {
            responseType: 'blob',
        });
    },

    downloadXlsxMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/xlsx-metadata`, {
            responseType: 'blob',
        });
    },

    downloadTxtMetadata: (id: ReleasesData['id']) => {
        return axiosInstance.get(`/releases/${id}/download/txt-metadata`, {
            responseType: 'blob',
        });
    },

    generateUpc: (id: ReleasesData['id']) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            `/releases/${id}/gen-upc`
        );
    },

    downloadTemplate: () => {
        return axiosInstance.get('/excel/download-template', {
            responseType: 'blob',
        });
    },

    createBucket: async (file: File, payload: CreateBucketFile) => {
        const response = await axiosInstance.post(
            '/bucket2/private/template',
            payload
        );
        if (response.status !== 201) {
            throw new Error(
                'Failed to get upload URL. Please try again later.'
            );
        }

        const { fileId, urlUpload } = response.data.data;

        const uploadResponse = await fetch(urlUpload, {
            method: 'PUT',
            headers: {
                'Content-Type': payload.file.contentType,
            },
            body: file,
        });

        if (!uploadResponse.ok) {
            throw new Error('Failed to upload file. Please try again later.');
        }

        return fileId;
    },

    exportTemplateCi: ({ ids, dspCodeCi }: ExportTemplateCi) => {
        return axiosInstance.post(
            '/releases/file-export-release-ci',
            {
                ids,
                dspCodeCi,
            },
            {
                responseType: 'blob',
            }
        );
    },
    getReleaseXml: (id: ReleasesData['id'], code: string) => {
        return axiosInstance.get(`/releases/${id}/xml`, {
            params: { code },
        });
    },

    takedownRelease: (id: ReleasesData['id'], code: string[]) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            `/releases/${id}/takedown`,
            { code }
        );
    },
    bulkSubmit: (payload: BulkSubmitRelease) => {
        return axiosInstance.post('/releases/bulk-submit', payload);
    },

    previewBulkSubmitResult: (payload: BulkSubmitRelease) => {
        return axiosInstance.post(
            '/releases/bulk-submit/preview-result',
            payload
        );
    },

    autoSubmitUndistributedMusic: ({
        dspCodes,
        status,
        neverExported,
        lastImportFailed,
    }: AutoSubmitUndistributedMusicRelease) => {
        return axiosInstance.post('/releases/auto-submit-undistributed-music', {
            dspCodes,
            status,
            neverExported,
            lastImportFailed,
        });
    },

    previewAutoSubmitUndistributedMusic: ({
        dspCodes,
        status,
        neverExported,
        lastImportFailed,
    }: AutoSubmitUndistributedMusicRelease) => {
        return axiosInstance.post(
            '/releases/auto-submit-undistributed-music/preview',
            {
                dspCodes,
                status,
                neverExported,
                lastImportFailed,
            }
        );
    },

    bulkDeleteReleaseDraft: (ids: Key[]) => {
        return axiosInstance.delete('/releases/draft', {
            params: { ids: ids.join(',') },
        });
    },

    syncReleaseDraftToTracks: (
        id: ReleasesData['id'],
        payload: SyncReleaseDraftToTracksPayload
    ) => {
        return axiosInstance.post(
            `/releases/draft/${id}/sync-to-tracks`,
            payload
        );
    },

    getReleaseCaptions: (releaseId: string, type?: string) => {
        return axiosInstance.get<DetailResponse<ReleaseCaptionData[]>>(
            `/releases/${releaseId}/release-captions`,
            { params: { type } }
        );
    },

    upsertReleaseCaptions: (payload: UpsertReleaseCaptionsPayload) => {
        const { releaseId, ...rest } = payload;
        return axiosInstance.post(
            `/releases/${releaseId}/release-captions`,
            rest
        );
    },

    updateReleaseCaption: (payload: UpdateReleaseCaptionPayload) => {
        const { id, ...rest } = payload;
        return axiosInstance.put(`/releases/release-captions/${id}`, rest);
    },

    deleteReleaseCaption: (id: string) => {
        return axiosInstance.delete(`/releases/release-captions/${id}`);
    },

    getReleaseReviews: (params: ReleaseReviewFilter) => {
        return axiosInstance.get<PaginationResponse<ReleaseReview>>(
            '/release-reviews',
            {
                params,
            }
        );
    },
};
