import { EXPORT_REPORT_JOB_STATUS } from '@/modules/analytics2/constants/export-report';

export type ExportReportJobStatus =
    (typeof EXPORT_REPORT_JOB_STATUS)[keyof typeof EXPORT_REPORT_JOB_STATUS];
