import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import DateSelect2 from '@/components/ui/select/date-select2';
import LabelSelect from '@/components/ui/select/label-select';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { useExportAnalyticsReport } from '@/modules/analytics2/hooks/use-export-analytics-report';
import { useExportAnalyticsStatementReport } from '@/modules/analytics2/hooks/use-export-analytics-statement-report';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import DspSelect from '@/modules/dsp/components/select/dsp-select';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import { DetailResponse } from '@/types/api';
import { Button, Form, Modal, Radio } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useExportJobStore } from '../../store/use-export-job-store';
import {
    Analytics2DataFilter,
    ExportReportRequest,
    ExportReportResponse,
} from '../../types';

export interface ExportReportInitialValues {
    fromDate?: string;
    toDate?: string;
    tenantId?: string;
    tenantIds?: string[];
    labelId?: string;
    artistId?: string;
    releaseId?: string;
    dspId?: string;
    pgDspId?: string;
    dspReportId?: string;
    isrc?: string;
    channelId?: string;
    importSource?: string;
}

interface ExportReportModalProps {
    open: boolean;
    onClose: () => void;
    onExportStarted?: (jobId: string) => void;
    dataFilter?: Analytics2DataFilter;
    initialValues?: ExportReportInitialValues;
}

export default function ExportReportModal({
    open,
    onClose,
    onExportStarted,
    dataFilter,
    initialValues,
}: ExportReportModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { profile } = useAuth();
    const addJob = useExportJobStore((state) => state.addJob);

    const { exportAnalyticsReport, isPending: isExportingUsd } =
        useExportAnalyticsReport();
    const {
        exportAnalyticsStatementReport,
        isPending: isExportingStatement,
    } = useExportAnalyticsStatementReport();

    const isExporting = isExportingUsd || isExportingStatement;

    const watchedArtistId = Form.useWatch('artistId', form);
    const watchedTenantId = Form.useWatch('tenantId', form);

    const { data: tenantActiveData } = useTenantActive();
    const activeTenantIds = useMemo(() => {
        return tenantActiveData?.items?.map((t: any) => t.id) ?? [];
    }, [tenantActiveData]);

    useEffect(() => {
        if (open) {
            form.resetFields();

            const rawStartDate =
                initialValues?.fromDate ??
                dataFilter?.startDate ??
                dayjs().startOf('month').format('YYYY-MM-DD');
            const rawEndDate =
                initialValues?.toDate ??
                dataFilter?.endDate ??
                dayjs().endOf('month').format('YYYY-MM-DD');

            const startDate = dayjs(rawStartDate).isValid()
                ? dayjs(rawStartDate).startOf('month').format('YYYY-MM-DD')
                : dayjs().startOf('month').format('YYYY-MM-DD');
            const endDate = dayjs(rawEndDate).isValid()
                ? dayjs(rawEndDate).endOf('month').format('YYYY-MM-DD')
                : dayjs().endOf('month').format('YYYY-MM-DD');

            const currentTenantId = profile?.tenantId;
            const hasActiveTenant =
                currentTenantId && activeTenantIds.includes(currentTenantId);

            const initialTenantId =
                initialValues?.tenantId &&
                activeTenantIds.includes(initialValues.tenantId)
                    ? initialValues.tenantId
                    : initialValues?.tenantIds?.[0] &&
                        activeTenantIds.includes(initialValues.tenantIds[0])
                      ? initialValues.tenantIds[0]
                      : hasActiveTenant
                        ? currentTenantId
                        : undefined;

            form.setFieldsValue({
                reportType: 'statement',
                dateRange: `${startDate},${endDate}`,
                tenantId: initialTenantId,
                labelId: initialValues?.labelId || undefined,
                artistId: initialValues?.artistId || undefined,
                dspId: initialValues?.dspId || undefined,
            });
        }
    }, [open, form, profile, activeTenantIds, initialValues, dataFilter]);

    const handleExport = (values: {
        reportType?: 'statement' | 'usd';
        dateRange: string;
        tenantId?: string;
        labelId?: string;
        artistId?: string;
        dspId?: string;
    }) => {
        const [startDate, endDate] = values.dateRange.split(',');
        const fromDate = dayjs(startDate).format('YYYY-MM');
        const endDateVal = dayjs(endDate).format('YYYY-MM');

        const payload: ExportReportRequest = {
            fromDate,
            endDate: endDateVal,
            format: 'xlsx',
            ...(values.tenantId ? { tenantIds: [values.tenantId] } : {}),
            ...(values.labelId ? { labelId: values.labelId } : {}),
            ...(values.artistId ? { artistId: values.artistId } : {}),
            ...(values.dspId
                ? {
                      dspId: values.dspId,
                      pgDspId: values.dspId,
                      dspReportId: values.dspId,
                  }
                : {}),
        };

        const exportFn =
            values.reportType === 'usd'
                ? exportAnalyticsReport
                : exportAnalyticsStatementReport;

        exportFn({
            payload,
            onSuccess: (data: DetailResponse<ExportReportResponse>) => {
                if (data?.data?.jobId) {
                    onExportStarted?.(data.data.jobId);
                    addJob(data.data.jobId);
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
            width={'50vw'}
            style={{ maxWidth: 'calc(100vw - 24px)' }}
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
                    name="reportType"
                    label={messages('common.currencyConversion')}
                >
                    <Radio.Group>
                        <Radio value="statement">
                            {messages('common.exportOriginalReport')}
                        </Radio>
                        <Radio value="usd">
                            {messages('common.exportUsdReport')}
                        </Radio>
                    </Radio.Group>
                </AppFormItem>

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
                    <DateSelect2 style={{ width: '100%' }} picker="month" />
                </AppFormItem>

                <AppFormItem
                    name="tenantId"
                    label={messages('tenant.selectTitle')}
                >
                    <TenantSelectActive
                        placeholder={messages('tenant.selectTitle')}
                        allowClear
                        onChange={() => {
                            form.setFieldsValue({
                                labelId: undefined,
                                artistId: undefined,
                            });
                        }}
                    />
                </AppFormItem>

                <AppFormItem name="labelId" label={messages('label.label')}>
                    <LabelSelect
                        tenantId={watchedTenantId}
                        placeholder={messages('placeholder.selectLabel')}
                        allowClear
                    />
                </AppFormItem>

                <AppFormItem name="artistId" label={messages('artist.label')}>
                    <ArtistSelect
                        tenantId={watchedTenantId}
                        artistId={watchedArtistId || initialValues?.artistId}
                        placeholder={messages('placeholder.selectArtist')}
                        allowClear
                        showCreate={false}
                    />
                </AppFormItem>

                <AppFormItem name="dspId" label="DSP">
                    <DspSelect
                        placeholder={messages('placeholder.selectDsp')}
                        allowClear
                    />
                </AppFormItem>
            </AppForm>
        </Modal>
    );
}
