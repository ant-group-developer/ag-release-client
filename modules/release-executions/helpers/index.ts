import dayjs from 'dayjs';
import { RELEASE_EXECUTION_STATUS, STEP_STATUS } from '../enums';

export const getStatusColor = (status?: RELEASE_EXECUTION_STATUS) => {
    switch (status) {
        case RELEASE_EXECUTION_STATUS.COMPLETED:
            return 'success';
        case RELEASE_EXECUTION_STATUS.PARTIALLY_COMPLETED:
            return 'warning';
        case RELEASE_EXECUTION_STATUS.FAILED:
        case RELEASE_EXECUTION_STATUS.CANCELLED:
            return 'error';
        case RELEASE_EXECUTION_STATUS.RUNNING:
            return 'processing';
        case RELEASE_EXECUTION_STATUS.AWAITING_ACTION:
            return 'purple';
        case RELEASE_EXECUTION_STATUS.QUEUED:
        default:
            return 'default';
    }
};

export const getStepStatusColor = (status?: STEP_STATUS) => {
    switch (status) {
        case STEP_STATUS.SUCCESS:
            return 'success';
        case STEP_STATUS.FAILED:
        case STEP_STATUS.CANCELLED:
            return 'error';
        case STEP_STATUS.RUNNING:
            return 'processing';
        case STEP_STATUS.WAITING_ACTION:
            return 'warning';
        case STEP_STATUS.SKIPPED:
            return 'default';
        case STEP_STATUS.PENDING:
        default:
            return 'default';
    }
};

const MINUTE_IN_MS = 60 * 1000;
const HOUR_IN_MS = 60 * MINUTE_IN_MS;
const DAY_IN_MS = 24 * HOUR_IN_MS;

const formatUnit = (value: number, suffix: string) => `${value}${suffix}`;

export const formatEnumLabel = (value?: string | null) => {
    if (!value) return '-';

    return value
        .toLowerCase()
        .split('_')
        .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
        .join(' ');
};

export const formatRelativeShort = (date?: string | null) => {
    if (!date) return null;

    const targetDate = dayjs(date);
    if (!targetDate.isValid()) return null;

    const diff = dayjs().diff(targetDate);
    if (diff < 0) return 'just now';
    if (diff < MINUTE_IN_MS) return 'just now';
    if (diff < HOUR_IN_MS) {
        return `${formatUnit(Math.floor(diff / MINUTE_IN_MS), 'm')} ago`;
    }
    if (diff < DAY_IN_MS) {
        return `${formatUnit(Math.floor(diff / HOUR_IN_MS), 'h')} ago`;
    }

    return `${formatUnit(Math.floor(diff / DAY_IN_MS), 'd')} ago`;
};

export const formatDurationShort = (
    startDate?: string | null,
    endDate?: string | null
) => {
    if (!startDate || !endDate) return null;

    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) return null;

    const diff = end.diff(start);
    if (diff < 0) return null;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;

    if (days > 0) {
        const remainder = hours > 0 ? formatUnit(hours, 'h') : formatUnit(minutes, 'm');
        return `completed in ${formatUnit(days, 'd')}${remainder}`;
    }

    if (hours > 0) {
        const remainder =
            minutes > 0 ? formatUnit(minutes, 'm') : formatUnit(seconds, 's');
        return `completed in ${formatUnit(hours, 'h')}${remainder}`;
    }

    if (minutes > 0) {
        return `completed in ${formatUnit(minutes, 'm')}${formatUnit(
            seconds,
            's'
        )}`;
    }

    return `completed in ${formatUnit(seconds, 's')}`;
};
