import axiosInstance from '@/api/axios-auth';
import { PaginationResponse } from '@/types/api';
import {
    ApproveReviewPayload,
    DistributionChannel,
    DistributionListFilter,
    DistributionListItem,
    DistributionMetrics,
    DistributionTicket,
    LatestDistributionInfo,
    OkResponse,
    RejectReviewPayload,
    ResponseSuccess,
    RetryDistributionPayload,
    SubmitDistributionPayload,
    SubmitDistributionResponse,
    TimelineQuery,
    TimelineResult,
} from '../types';

/**
 * API client cho module server `distribution-orchestration` (prefix `/distributions`).
 * Gọi qua rewrite `/api/v1/*` (axios-auth baseURL đã set `/api/v1`).
 *
 * Command trả trực tiếp ({ distributionId } | { ok: true });
 * query (timeline/metrics) bọc trong ResponseSuccess<T>.
 * SSE `/stream` KHÔNG dùng axios — xem hook `use-distribution-stream`.
 */
export const distributionOrchestrationApis = {
    /** POST /distributions — submit release để phát hành. */
    submit: (payload: SubmitDistributionPayload) => {
        return axiosInstance.post<SubmitDistributionResponse>(
            '/distributions',
            payload
        );
    },

    /** POST /distributions/:id/review/approve — duyệt distribution IN_REVIEW. */
    approveReview: (id: string, payload: ApproveReviewPayload = {}) => {
        return axiosInstance.post<OkResponse>(
            `/distributions/${id}/review/approve`,
            payload
        );
    },

    /** POST /distributions/:id/review/reject — từ chối distribution IN_REVIEW. */
    rejectReview: (id: string, payload: RejectReviewPayload = {}) => {
        return axiosInstance.post<OkResponse>(
            `/distributions/${id}/review/reject`,
            payload
        );
    },

    /** POST /distributions/:id/retry — reset subtree ISSUES → resume. */
    retry: (id: string, payload: RetryDistributionPayload = {}) => {
        return axiosInstance.post<OkResponse>(
            `/distributions/${id}/retry`,
            payload
        );
    },

    /** GET /distributions/:id/timeline — cursor pagination. */
    getTimeline: (id: string, query: TimelineQuery = {}) => {
        return axiosInstance.get<ResponseSuccess<TimelineResult>>(
            `/distributions/${id}/timeline`,
            { params: query }
        );
    },

    /** GET /distributions/metrics — observability (admin). */
    getMetrics: () => {
        return axiosInstance.get<ResponseSuccess<DistributionMetrics>>(
            '/distributions/metrics'
        );
    },

    /** GET /distributions — list phát hành + DistributionState (release-centric). */
    getList: (params: DistributionListFilter) => {
        return axiosInstance.get<PaginationResponse<DistributionListItem>>(
            '/distributions',
            { params }
        );
    },

    /** GET /distributions/:id/tickets — flag lỗi (reviewer + CI/QA/Spotify). */
    getTickets: (id: string) => {
        return axiosInstance.get<ResponseSuccess<DistributionTicket[]>>(
            `/distributions/${id}/tickets`
        );
    },

    /** POST /distributions/:id/tickets/:ticketId/resolve — đánh dấu flag đã sửa. */
    resolveTicket: (id: string, ticketId: string) => {
        return axiosInstance.post<OkResponse>(
            `/distributions/${id}/tickets/${ticketId}/resolve`
        );
    },

    /** GET /distributions/:id/channels — trạng thái phát hành từng DSP. */
    getChannels: (id: string) => {
        return axiosInstance.get<ResponseSuccess<DistributionChannel[]>>(
            `/distributions/${id}/channels`
        );
    },

    /** GET /distributions/by-release/:releaseId — distribution mới nhất của 1 release. */
    getByRelease: (releaseId: string) => {
        return axiosInstance.get<
            ResponseSuccess<LatestDistributionInfo | null>
        >(`/distributions/by-release/${releaseId}`);
    },
};
