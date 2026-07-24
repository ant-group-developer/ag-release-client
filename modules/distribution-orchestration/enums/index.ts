/**
 * Enums mirror module server `distribution-orchestration`.
 *
 * QUAN TRỌNG: string value phải khớp 100% với server để so khớp trạng thái/loại.
 * Nguồn:
 *  - ExecutionType   ← domain/value-objects/execution-type.enum.ts
 *  - DistributionState ← domain/distribution/distribution-state.enum.ts
 *  - ChannelState    ← domain/channel-delivery/channel-state.enum.ts
 *  - ChannelTopology ← domain/channel-delivery/channel-topology.enum.ts
 *  - ExportMethod    ← domain/channel-delivery/channel-delivery-spec.ts (union type)
 */

/** Loại execution khi submit distribution. */
export enum EXECUTION_TYPE {
    INITIAL_RELEASE = 'INITIAL_RELEASE',
    UPDATE = 'UPDATE',
    TAKEDOWN = 'TAKEDOWN',
    RETRY = 'RETRY',
}

/** Trạng thái milestone cấp Distribution (release-level). */
export enum DISTRIBUTION_STATE {
    DRAFT = 'DRAFT',
    VALIDATING = 'VALIDATING',
    IN_REVIEW = 'IN_REVIEW',
    PROVISIONING_IDS = 'PROVISIONING_IDS',
    BUILDING_PACKAGE = 'BUILDING_PACKAGE',
    DELIVERING = 'DELIVERING',
    // terminal / semi-terminal
    DISTRIBUTED = 'DISTRIBUTED',
    PARTIALLY_DISTRIBUTED = 'PARTIALLY_DISTRIBUTED',
    FAILED = 'FAILED',
    ACTION_REQUIRED = 'ACTION_REQUIRED',
    TAKEN_DOWN = 'TAKEN_DOWN',
}

/** Tập state kết thúc ở cấp Distribution — dùng để tắt SSE + ẩn nút action. */
export const DISTRIBUTION_TERMINAL_STATES: readonly DISTRIBUTION_STATE[] = [
    DISTRIBUTION_STATE.DISTRIBUTED,
    DISTRIBUTION_STATE.PARTIALLY_DISTRIBUTED,
    DISTRIBUTION_STATE.FAILED,
    DISTRIBUTION_STATE.TAKEN_DOWN,
];

/** Trạng thái chung cho mọi channel (nhỏ, cố định). */
export enum CHANNEL_STATE {
    PENDING = 'PENDING',
    DELIVERING = 'DELIVERING',
    WAITING = 'WAITING',
    // terminal
    LIVE = 'LIVE',
    ISSUES = 'ISSUES',
    TAKEN_DOWN = 'TAKEN_DOWN',
    SKIPPED = 'SKIPPED',
}

/** Metadata gom nhóm channel (chỉ để UI/policy chọn process, KHÔNG drive transition). */
export enum CHANNEL_TOPOLOGY {
    DIRECT = 'DIRECT',
    VIA_AGGREGATOR = 'VIA_AGGREGATOR',
}

/** Cách export cho aggregator (chọn cơ chế ở Exporter port). */
export enum EXPORT_METHOD {
    CI_DEAL = 'CI_DEAL',
    STATE51 = 'STATE51',
}

/** Level của timeline event — server quyết định default theo role. */
export enum EVENT_LEVEL {
    MILESTONE = 'milestone',
    PROGRESS = 'progress',
}
