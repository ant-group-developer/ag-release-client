import { CHANNEL_STATE, DISTRIBUTION_STATE, EVENT_LEVEL } from '../enums';

/** Màu antd Tag/Badge cho DistributionState. */
export const getDistributionStateColor = (state?: DISTRIBUTION_STATE) => {
    switch (state) {
        case DISTRIBUTION_STATE.DISTRIBUTED:
            return 'success';
        case DISTRIBUTION_STATE.PARTIALLY_DISTRIBUTED:
            return 'warning';
        case DISTRIBUTION_STATE.FAILED:
            return 'error';
        case DISTRIBUTION_STATE.ACTION_REQUIRED:
            return 'volcano';
        case DISTRIBUTION_STATE.IN_REVIEW:
            return 'purple';
        case DISTRIBUTION_STATE.TAKEN_DOWN:
            return 'default';
        case DISTRIBUTION_STATE.VALIDATING:
        case DISTRIBUTION_STATE.PROVISIONING_IDS:
        case DISTRIBUTION_STATE.BUILDING_PACKAGE:
        case DISTRIBUTION_STATE.DELIVERING:
            return 'processing';
        case DISTRIBUTION_STATE.DRAFT:
        default:
            return 'default';
    }
};

/** Màu antd Tag/Badge cho ChannelState. */
export const getChannelStateColor = (state?: CHANNEL_STATE) => {
    switch (state) {
        case CHANNEL_STATE.LIVE:
            return 'success';
        case CHANNEL_STATE.ISSUES:
            return 'error';
        case CHANNEL_STATE.WAITING:
            return 'warning';
        case CHANNEL_STATE.DELIVERING:
            return 'processing';
        case CHANNEL_STATE.TAKEN_DOWN:
        case CHANNEL_STATE.SKIPPED:
        case CHANNEL_STATE.PENDING:
        default:
            return 'default';
    }
};

/** Milestone events nổi bật hơn progress events trên timeline. */
export const isMilestoneLevel = (level?: EVENT_LEVEL) =>
    level === EVENT_LEVEL.MILESTONE;
