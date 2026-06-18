import DateSelect2 from '@/components/ui/select/date-select2';
import { useExportAnalyticsReport } from '@/modules/analytics2/hooks/use-export-analytics-report';
import { DetailResponse } from '@/types/api';
import { Button, Modal } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { ExportReportResponse } from '../../types';

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
    onExportStarted: (jobId: string) => void;
}

export default function ExportReportModal({
    open,
    onClose,
    onExportStarted,
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
        exportAnalyticsReport({
            payload: {
                fromDate: dayjs(exportDateRange.startDate).format('YYYY-MM'),
                endDate: dayjs(exportDateRange.endDate).format('YYYY-MM'),
            },
            onSuccess: (data: DetailResponse<ExportReportResponse>) => {
                if (data?.data?.jobId) {
                    onExportStarted(data.data.jobId);
                    handleClose();
                }
            },
        });
    };

    const handleClose = () => {
        onClose();
    };

    return (
        <Modal
            title={messages('common.exportReport')}
            open={open}
            onCancel={handleClose}
            destroyOnHidden
            footer={[
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
            ]}
        >
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
        </Modal>
    );
}
