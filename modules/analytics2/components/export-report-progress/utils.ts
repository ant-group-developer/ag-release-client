import { EXPORT_REPORT_PROGRESS_POPOVER } from '@/modules/analytics2/constants/export-report';
import { ExportReportEventSummary } from '@/modules/analytics2/types';

export const getExportReportProgressPercent = (
    progress?: ExportReportEventSummary['progress']
) => {
    if (!progress?.total) return 0;

    return Math.min(
        Math.round(
            (progress.current / progress.total) *
                EXPORT_REPORT_PROGRESS_POPOVER.maxProgressPercent
        ),
        EXPORT_REPORT_PROGRESS_POPOVER.maxProgressPercent
    );
};
