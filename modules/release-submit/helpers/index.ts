import dayjs from 'dayjs';
import {
    RELEASE_SUBMIT_LOG_LEVEL,
    RELEASE_SUBMIT_STATUS,
    RELEASE_SUBMIT_STEP_STATUS,
    RELEASE_SUBMIT_TYPE,
} from '../enums';

export const getReleaseSubmitStatusColor = (status?: RELEASE_SUBMIT_STATUS) => {
    switch (status) {
        case RELEASE_SUBMIT_STATUS.DONE:
            return 'green';
        case RELEASE_SUBMIT_STATUS.WAITING_ACTION:
            return 'blue';
        case RELEASE_SUBMIT_STATUS.CANCELLED:
            return 'magenta';
        case RELEASE_SUBMIT_STATUS.FAILED:
            return 'red';
        case RELEASE_SUBMIT_STATUS.PROCESSING:
            return 'blue';
        case RELEASE_SUBMIT_STATUS.NEW:
            return 'geekblue';
        case RELEASE_SUBMIT_STATUS.PARTIAL_DONE:
            return 'lime';
        default:
            return 'default';
    }
};

export const getReleaseSubmitTypeColor = (type?: RELEASE_SUBMIT_TYPE) => {
    switch (type) {
        case RELEASE_SUBMIT_TYPE.INITIAL_RELEASE:
            return 'blue';
        case RELEASE_SUBMIT_TYPE.UPDATE:
            return 'orange';
        case RELEASE_SUBMIT_TYPE.TAKEDOWN:
            return 'magenta';
        case RELEASE_SUBMIT_TYPE.RETRY:
            return 'orange';
        default:
            return 'default';
    }
};

export const getReleaseSubmitStepStatusColor = (
    status?: RELEASE_SUBMIT_STEP_STATUS
) => {
    switch (status) {
        case RELEASE_SUBMIT_STEP_STATUS.SUCCESS:
            return 'success';
        case RELEASE_SUBMIT_STEP_STATUS.FAILED:
        case RELEASE_SUBMIT_STEP_STATUS.CANCELLED:
            return 'error';
        case RELEASE_SUBMIT_STEP_STATUS.RUNNING:
            return 'geekblue';
        case RELEASE_SUBMIT_STEP_STATUS.PENDING:
            return 'warning';
        case RELEASE_SUBMIT_STEP_STATUS.PROCESSING:
            return 'blue';
        case RELEASE_SUBMIT_STEP_STATUS.WAITING_ACTION:
            return 'purple';
        case RELEASE_SUBMIT_STEP_STATUS.DONE:
            return 'success';

        default:
            return 'default';
    }
};

export const getReleaseSubmitLogLevelColor = (
    level?: RELEASE_SUBMIT_LOG_LEVEL
) => {
    switch (level) {
        case RELEASE_SUBMIT_LOG_LEVEL.SUCCESS:
            return 'success';
        case RELEASE_SUBMIT_LOG_LEVEL.ERROR:
            return 'error';
        case RELEASE_SUBMIT_LOG_LEVEL.WARNING:
            return 'warning';
        case RELEASE_SUBMIT_LOG_LEVEL.LOG:
            return 'blue';
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
    endDate?: string | null,
    prefix?: string
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

    const label = prefix ?? 'Completed in';

    if (days > 0) {
        const remainder =
            hours > 0 ? formatUnit(hours, 'h') : formatUnit(minutes, 'm');
        return `${label} ${formatUnit(days, 'd')}${remainder}`;
    }

    if (hours > 0) {
        const remainder =
            minutes > 0 ? formatUnit(minutes, 'm') : formatUnit(seconds, 's');
        return `${label} ${formatUnit(hours, 'h')}${remainder}`;
    }

    if (minutes > 0) {
        return `${label} ${formatUnit(minutes, 'm')}${formatUnit(
            seconds,
            's'
        )}`;
    }

    return `${label} ${formatUnit(seconds, 's')}`;
};

export const formatDisplayContent = (value: unknown) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string') return value;

    try {
        return JSON.stringify(value, null, 2);
    } catch {
        return String(value);
    }
};
