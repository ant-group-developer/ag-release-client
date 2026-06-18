import {
    EXPORT_REPORT_COMPLETED_EVENT_VALUES,
    EXPORT_REPORT_FAILED_EVENT_VALUES,
} from '../constants/export-report';
import {
    ExportReportEventData,
    ExportReportEventSummary,
    ExportReportEventType,
} from '../types';

const normalizeExportReportEventValue = (value?: string | null) =>
    value?.trim().toLowerCase();

const isMatchingEventValue = (
    value: string | undefined,
    acceptedValues: readonly string[]
) => {
    if (!value) return false;

    return acceptedValues.includes(value);
};

export const isExportReportCompleted = (
    eventData?: ExportReportEventData | null,
    summary?: Partial<ExportReportEventSummary> | null
) => {
    const eventType = normalizeExportReportEventValue(eventData?.type);
    const status = normalizeExportReportEventValue(
        summary?.status || eventData?.status
    );
    const message = normalizeExportReportEventValue(eventData?.message);
    const progressLabel = normalizeExportReportEventValue(
        summary?.progress?.label || eventData?.progress?.label
    );
    const progress = summary?.progress || eventData?.progress;
    const hasDownloadUrl = Boolean(
        summary?.result?.downloadUrl || eventData?.result?.downloadUrl
    );
    const isProgressComplete = Boolean(
        progress?.total && progress.current >= progress.total
    );

    return (
        eventType === ExportReportEventType.COMPLETED ||
        hasDownloadUrl ||
        isMatchingEventValue(status, EXPORT_REPORT_COMPLETED_EVENT_VALUES) ||
        isMatchingEventValue(message, EXPORT_REPORT_COMPLETED_EVENT_VALUES) ||
        isMatchingEventValue(
            progressLabel,
            EXPORT_REPORT_COMPLETED_EVENT_VALUES
        ) ||
        (isProgressComplete &&
            (isMatchingEventValue(
                status,
                EXPORT_REPORT_COMPLETED_EVENT_VALUES
            ) ||
                isMatchingEventValue(
                    message,
                    EXPORT_REPORT_COMPLETED_EVENT_VALUES
                ) ||
                isMatchingEventValue(
                    progressLabel,
                    EXPORT_REPORT_COMPLETED_EVENT_VALUES
                )))
    );
};

export const isExportReportFailed = (
    eventData?: ExportReportEventData | null,
    summary?: Partial<ExportReportEventSummary> | null
) => {
    const eventType = normalizeExportReportEventValue(eventData?.type);
    const status = normalizeExportReportEventValue(
        summary?.status || eventData?.status
    );
    const message = normalizeExportReportEventValue(eventData?.message);

    return (
        eventType === ExportReportEventType.FAILED ||
        isMatchingEventValue(status, EXPORT_REPORT_FAILED_EVENT_VALUES) ||
        isMatchingEventValue(message, EXPORT_REPORT_FAILED_EVENT_VALUES) ||
        Boolean(summary?.error || eventData?.error)
    );
};
