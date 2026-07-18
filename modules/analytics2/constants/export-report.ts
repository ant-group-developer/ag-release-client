export const EXPORT_REPORT_PROGRESS_POPOVER = {
    widthClassName: 'w-[320px] max-w-[calc(100vw-32px)]',
    zIndexClassName: 'z-50',
    defaultCompletedCount: 1,
    maxProgressPercent: 100,
    circleSize: 28,
} as const;

export const EXPORT_REPORT_JOB_STATUS = {
    RUNNING: 'running',
    COMPLETED: 'completed',
    FAILED: 'failed',
} as const;

export const EXPORT_REPORT_COMPLETED_EVENT_VALUES = [
    'done',
    'completed',
    'success',
] as const;

export const EXPORT_REPORT_FAILED_EVENT_VALUES = [
    'failed',
    'failure',
    'error',
] as const;

export const CANCEL_CONFIRM_MODAL_WIDTH = 400;
export const WARNING_ICON_COLOR = '#faad14';
