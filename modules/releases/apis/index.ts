import axiosInstance from '@/api/axios-auth';
import { CreateBucketFile } from '@/modules/upload/types/data';
import { DetailResponse, PaginationResponse } from '@/types/api';
import { Key } from 'react';
import {
    ReleasesData,
    ReleasesDataFilter,
    ReleasesDataSimple,
    ReleaseValidate,
} from '../types';
import {
    BulkSubmitRelease,
    CreateReleaseDraftPayload,
    ExportTemplateCi,
    SyncReleaseDraftToTracksPayload,
    UpdateReleaseDraftPayload,
    BulkUpsertCaptionsPayload,
} from '../types/payload';

export const releasesApi = {
    getList: (params: ReleasesDataFilter) => {
        return axiosInstance.get<PaginationResponse<ReleasesData>>(
            '/releases',
            {
                params,
            }
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

    takedownRelease: (id: ReleasesData['id']) => {
        return axiosInstance.post<DetailResponse<ReleasesData>>(
            `/releases/${id}/takedown`
        );
    },

    bulkSubmit: ({ ids, codes }: BulkSubmitRelease) => {
        return axiosInstance.post('/releases/bulk-submit', {
            ids,
            codes,
        });
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

    bulkUpsertCaptions: (payload: BulkUpsertCaptionsPayload) => {
        return axiosInstance.post('/videos/captions/bulk-upsert', payload);
    },
};
