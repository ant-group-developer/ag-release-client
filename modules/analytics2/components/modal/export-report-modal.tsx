import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DateSelect2 from '@/components/ui/select/date-select2';
import { useExportAnalyticsReport } from '@/modules/analytics2/hooks/use-export-analytics-report';
import { DetailResponse } from '@/types/api';
import { Button, Form, Modal } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Analytics2DataFilter, ExportReportResponse } from '../../types';

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
    onExportStarted: (jobId: string) => void;
    dataFilter?: Analytics2DataFilter;
}

export default function ExportReportModal({
    open,
    onClose,
    onExportStarted,
    dataFilter,
}: ExportReportModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();

    const { exportAnalyticsReport, isPending: isExporting } =
        useExportAnalyticsReport();

    useEffect(() => {
        if (open) {
            const startDate =
                dataFilter?.startDate ??
                dayjs().startOf('month').format('YYYY-MM-DD');
            const endDate =
                dataFilter?.endDate ??
                dayjs().endOf('month').format('YYYY-MM-DD');
            form.setFieldsValue({
                dateRange: `${startDate},${endDate}`,
            });
        }
    }, [open, dataFilter, form]);

    const handleExport = (values: { dateRange: string }) => {
        const [startDate, endDate] = values.dateRange.split(',');
        exportAnalyticsReport({
            payload: {
                fromDate: dayjs(startDate).format('YYYY-MM'),
                endDate: dayjs(endDate).format('YYYY-MM'),
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
        form.resetFields();
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
                    onClick={form.submit}
                >
                    {messages('common.export')}
                </Button>,
            ]}
        >
            <AppForm
                form={form}
                onFinish={handleExport}
                showSubmit={false}
                layout="vertical"
                disabled={isExporting}
            >
                <AppFormItem
                    name="dateRange"
                    label={messages('common.time')}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <DateSelect2
                        style={{ width: '100%' }}
                        picker="month"
                    />
                </AppFormItem>
            </AppForm>
        </Modal>
    );
}
