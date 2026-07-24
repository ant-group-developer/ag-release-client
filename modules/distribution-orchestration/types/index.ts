import { ReleasesData } from '@/modules/releases/types';
import { CommonParams } from '@/types/api';
import {
    CHANNEL_STATE,
    CHANNEL_TOPOLOGY,
    DISTRIBUTION_STATE,
    EVENT_LEVEL,
    EXECUTION_TYPE,
    EXPORT_METHOD,
} from '../enums';

/**
 * Types mirror API server `distribution-orchestration`.
 * Command endpoints trả trực tiếp (KHÔNG bọc ResponseSuccess);
 * query endpoints (timeline/metrics) bọc trong ResponseSuccess<T>.
 */

/** Wrapper chung server dùng cho GET timeline/metrics (AppResponseSuccess.COMMON). */
export interface ResponseSuccess<T> {
    statusCode?: number;
    message?: string;
    messageCode?: string;
    data: T;
}

/* ───────── Request payloads ───────── */

/** Config 1 channel trong 1 distribution (input spawn ChannelDelivery). */
export interface ChannelDeliverySpec {
    /** DSP code (SPOTIFY, VEVO, CI…). */
    dspCode: string;
    /** Metadata gom nhóm channel. */
    topology: CHANNEL_TOPOLOGY;
    /** Code process trong registry (policy.resolveProcessCode chọn). */
    processCode: string;
    /** 'CI'… — chỉ VIA_AGGREGATOR. */
    aggregatorCode?: string;
    /** Chỉ VIA_AGGREGATOR. */
    exportMethod?: EXPORT_METHOD;
    /** per-DSP (Dsp.hasDeal) — tách CI deal vs State51. */
    hasDeal?: boolean;
}

/**
 * Body POST /distributions. `tenantId` KHÔNG gửi (server lấy từ JWT).
 * Client chỉ gửi dspCodes[]; server tự resolve ChannelDeliverySpec[] từ routing config.
 */
export interface SubmitDistributionPayload {
    releaseId: string;
    type: EXECUTION_TYPE;
    dspCodes: string[];
    /** Chống double-submit. Bỏ trống = server derive từ releaseId+type. */
    idempotencyKey?: string;
}

/** Body POST /distributions/:id/review/approve. */
export interface ApproveReviewPayload {
    idempotencyKey?: string;
}

/** Body POST /distributions/:id/review/reject. */
export interface RejectReviewPayload {
    /** Lý do reject (hiển thị cho user sửa), ≤2000 ký tự. */
    note?: string;
    /** Flag lỗi cấu trúc reviewer tạo (ghi vào ticket.metadata.items[]). */
    items?: TicketIssueItem[];
    idempotencyKey?: string;
}

/** Body POST /distributions/:id/retry. */
export interface RetryDistributionPayload {
    /** Channel ISSUES cần reset. Bỏ trống = reset mọi channel ISSUES. */
    channelIds?: string[];
    idempotencyKey?: string;
}

/* ───────── Responses ───────── */

/** POST /distributions → trả trực tiếp. */
export interface SubmitDistributionResponse {
    distributionId: string;
}

/** approve/reject/retry → trả trực tiếp. */
export interface OkResponse {
    ok: true;
}

/** 1 event trên timeline. */
export interface TimelineEvent {
    id: string;
    type: string;
    channelId: string | null;
    level: EVENT_LEVEL;
    payload: Record<string, unknown>;
    /** ISO string (server serialize Date). */
    occurredAt: string;
}

/** Kết quả GET /distributions/:id/timeline (bên trong ResponseSuccess.data). */
export interface TimelineResult {
    items: TimelineEvent[];
    /** null khi hết trang. */
    nextCursor: string | null;
}

/** Query GET timeline. */
export interface TimelineQuery {
    cursor?: string;
    /** default 50, max 200. */
    limit?: number;
}

/** Kết quả GET /distributions/metrics (admin). Shape mở — chưa khoá cứng server. */
export interface DistributionMetrics {
    projection: Record<string, unknown> & { lagSeconds?: number };
    sse: Record<string, unknown>;
}

/* ───────── List (GET /distributions) ───────── */

/**
 * 1 dòng list phát hành — release-centric: ReleasesData (cover/title/artist/label/DSP...)
 * + trạng thái distribution mới nhất (null nếu release chưa submit).
 */
export interface DistributionListItem extends ReleasesData {
    distributionId: string | null;
    distributionState: DISTRIBUTION_STATE | null;
    distributionType: EXECUTION_TYPE | null;
    distributionUpdatedAt: string | null;
    /** Server tính sẵn (release.query.service). Fallback đếm releaseDspDeliveries nếu thiếu. */
    dspsLiveCount?: number;
    dspsTotalCount?: number;
    dspsLive?: string;
}

/** Filter GET /distributions — kế thừa filter release + lọc theo distributionState. */
export interface DistributionListFilter extends CommonParams {
    type?: 'audio' | 'video';
    albumFormatId?: string;
    distributionState?: DISTRIBUTION_STATE;
    /** Lọc theo release cụ thể (dùng cho trang detail release-centric). */
    ids?: string[];
    /** Ẩn release nhập từ report (mặc định 'false' — giống trang releases). */
    isImportedFromReport?: string;
}

/* ───────── Tickets / flags (GET /distributions/:id/tickets) ───────── */

/** 1 flag lỗi chuẩn hoá (reviewer tạo hoặc CI/QA/Spotify). Khớp TicketIssueItem server. */
export interface TicketIssueItem {
    code: string;
    message: string;
    severity: 'error' | 'warning';
    location?: string;
    suggestion?: string;
}

/* ───────── Channels (GET /distributions/:id/channels) ───────── */

/** Trạng thái phát hành 1 DSP (channel_delivery orchestration). */
export interface DistributionChannel {
    channelId: string;
    dspCode: string;
    topology: CHANNEL_TOPOLOGY;
    state: CHANNEL_STATE;
    aggregatorCode: string | null;
    exportMethod: EXPORT_METHOD | null;
    retryCount: number;
    /** Mốc wake-up khi WAITING. */
    scheduledAt: string | null;
    ticketRef: string | null;
}

/** 1 ticket của distribution — gộp mọi nguồn lỗi, client render items[]. */
export interface DistributionTicket {
    id: string;
    distributionId: string;
    channelId: string | null;
    reason: string;
    detail: string;
    status: string;
    items: TicketIssueItem[];
    context: Record<string, unknown> | null;
    createdAt: string;
    resolvedAt: string | null;
}
