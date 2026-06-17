import DateSelect2 from '@/components/ui/select/date-select2';
import { useExportAnalyticsReport } from '@/modules/analytics2/hooks/use-export-analytics-report';
import { DetailResponse } from '@/types/api';
import { Alert, Button, Descriptions, Modal, Progress } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { ExportReportEventType, ExportReportResponse, ExportReportEventData, ExportReportEventSummary } from '../../types';

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
    jobId: string | null;
    setJobId: (jobId: string | null) => void;
    latestEvent: ExportReportEventData | null;
    summary: Partial<ExportReportEventSummary> | null;
    isListening: boolean;
    error: Error | null;
}

export default function ExportReportModal({
    open,
    onClose,
    jobId,
    setJobId,
    latestEvent,
    summary,
    isListening,
    error,
}: ExportReportModalProps) {
    const messages = useTranslations();
    const [exportDateRange, setExportDateRange] = useState<{
        startDate: string;
        endDate: string;
    }>({
        startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
        endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    });

    const { exportAnalyticsReport, isPending: isExporting } =
        useExportAnalyticsReport();

    useEffect(() => {
        if (open) {
            setExportDateRange({
                startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
                endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
            });
        }
    }, [open]);

    const handleExport = () => {
        if (jobId) {
            handleClose();
            return;
        }

        exportAnalyticsReport({
            payload: {
                fromDate: dayjs(exportDateRange.startDate).format('YYYY-MM'),
                endDate: dayjs(exportDateRange.endDate).format('YYYY-MM'),
            },
            onSuccess: (data: DetailResponse<ExportReportResponse>) => {
                if (data?.data?.jobId) {
                    setJobId(data.data.jobId);
                }
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    const progressPercent = useMemo(() => {
        if (!summary?.progress?.total) return 0;
        return Math.min(
            Math.round(
                (summary.progress.current / summary.progress.total) * 100
            ),
            100
        );
    }, [summary?.progress]);

    const isRunning = isExporting || isListening;
    const isCompleted = latestEvent?.type === ExportReportEventType.COMPLETED;
    const isFailed = latestEvent?.type === ExportReportEventType.FAILED;

    return (
        <Modal
            title={messages('common.exportReport')}
            open={open}
            onCancel={handleClose}
            destroyOnClose
            footer={
                jobId
                    ? [
                          isCompleted && summary?.result?.downloadUrl ? (
                              <Button
                                  key="download"
                                  type="primary"
                                  href={summary.result.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                              >
                                  {messages('common.download')}
                              </Button>
                          ) : null,
                          <Button
                              key="close"
                              type={
                                  isCompleted && summary?.result?.downloadUrl
                                      ? 'default'
                                      : 'primary'
                              }
                              onClick={handleClose}
                          >
                              {messages('common.close')}
                          </Button>,
                      ]
                    : [
                          <Button
                              key="cancel"
                              onClick={handleClose}
                              disabled={isExporting}
                          >
                              {messages('common.cancel')}
                          </Button>,
                          <Button
                              key="submit"
                              type="primary"
                              loading={isExporting}
                              onClick={handleExport}
                          >
                              {messages('common.export')}
                          </Button>,
                      ]
            }
        >
            {!jobId ? (
                <div className="flex flex-col gap-2 py-4">
                    <label>{messages('common.time')}</label>
                    <DateSelect2
                        style={{ width: '100%' }}
                        value={`${exportDateRange.startDate},${exportDateRange.endDate}`}
                        onChange={(value) => {
                            const [startDate, endDate] = value
                                .toString()
                                .split(',');
                            setExportDateRange({ startDate, endDate });
                        }}
                        picker="month"
                    />
                </div>
            ) : null}

            {jobId ? (
                <div className="flex flex-col gap-4 py-4">
                    <Alert
                        type={
                            isFailed
                                ? 'error'
                                : isCompleted
                                  ? 'success'
                                  : 'info'
                        }
                        showIcon
                        message={
                            latestEvent?.message ||
                            summary?.status ||
                            messages('common.processing')
                        }
                    />

                    {summary?.progress ? (
                        <div>
                            <div className="mb-1 text-sm text-gray-500">
                                {summary.progress.label ||
                                    messages('common.progress')}
                            </div>
                            <Progress percent={progressPercent} />
                        </div>
                    ) : null}

                    <Descriptions
                        size="small"
                        bordered
                        column={1}
                        style={{ marginTop: 8 }}
                    >
                        <Descriptions.Item label={messages('common.status')}>
                            {summary?.status || latestEvent?.type || '-'}
                        </Descriptions.Item>
                        {(summary?.file?.name || summary?.result?.fileName) && (
                            <Descriptions.Item
                                label={messages('common.fileName')}
                            >
                                {summary?.file?.name ||
                                    summary?.result?.fileName}
                            </Descriptions.Item>
                        )}
                        {summary?.rows?.total !== undefined && (
                            <Descriptions.Item label={messages('common.total')}>
                                {summary.rows.total.toLocaleString()}
                            </Descriptions.Item>
                        )}
                        {summary?.rows?.processed !== undefined && (
                            <Descriptions.Item
                                label={messages('common.success')}
                            >
                                {summary.rows.processed.toLocaleString()}
                            </Descriptions.Item>
                        )}
                        {summary?.rows?.skipped !== undefined && (
                            <Descriptions.Item label="Skipped">
                                {summary.rows.skipped.toLocaleString()}
                            </Descriptions.Item>
                        )}
                        {summary?.rows?.errors !== undefined &&
                            summary.rows.errors > 0 && (
                                <Descriptions.Item
                                    label={messages('common.errors')}
                                >
                                    {summary.rows.errors.toLocaleString()}
                                </Descriptions.Item>
                            )}
                    </Descriptions>

                    {error ? (
                        <Alert type="error" showIcon message={error.message} />
                    ) : null}
                </div>
            ) : null}
        </Modal>
    );
}
