import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import DateSelect2 from '@/components/ui/select/date-select2';
import { useExportAnalyticsReport } from '@/modules/analytics2/hooks/use-export-analytics-report';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { DetailResponse } from '@/types/api';
import { Button, Checkbox, Form, Modal, Radio } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo } from 'react';
import { useTenantActive } from '@/modules/tenant/hooks/use-get-tenant';
import {
    Analytics2DataFilter,
    EXPORT_OPTION,
    ExportReportResponse,
    PERIOD_TYPE,
} from '../../types';
import TenantSelectTable from '../table/tenant-select-table';

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
    const { profile } = useAuth();

    const { exportAnalyticsReport, isPending: isExporting } =
        useExportAnalyticsReport();

    const { data: tenantActiveData } = useTenantActive();
    const activeTenantIds = useMemo(() => {
        return tenantActiveData?.items?.map((t: any) => t.id) ?? [];
    }, [tenantActiveData]);

    const splitMode = Form.useWatch('splitMode', form);
    const periodUnit = Form.useWatch('periodUnit', form);

    // Reset/setup periodUnit when open
    useEffect(() => {
        if (open) {
            if (!form.getFieldValue('periodUnit')) {
                form.setFieldValue('periodUnit', PERIOD_TYPE.NONE);
            }
        }
    }, [open, form]);

    // Handle dateRange format when periodUnit changes
    useEffect(() => {
        if (open) {
            const currentPeriodUnit =
                form.getFieldValue('periodUnit') || PERIOD_TYPE.MONTH;
            if (currentPeriodUnit === PERIOD_TYPE.QUARTER) {
                const startDate = dayjs().startOf('year').format('YYYY-[Q]Q');
                const endDate = dayjs().format('YYYY-[Q]Q');
                form.setFieldValue('dateRange', `${startDate},${endDate}`);
            } else {
                const startDate =
                    dataFilter?.startDate ??
                    dayjs().startOf('month').format('YYYY-MM-DD');
                const endDate =
                    dataFilter?.endDate ??
                    dayjs().endOf('month').format('YYYY-MM-DD');
                form.setFieldValue('dateRange', `${startDate},${endDate}`);
            }
        }
    }, [open, periodUnit, dataFilter, form]);

    useEffect(() => {
        if (open) {
            const currentTenantId = profile?.tenantId;
            const hasActiveTenant = currentTenantId && activeTenantIds.includes(currentTenantId);
            form.setFieldsValue({
                splitMode: EXPORT_OPTION.BY_WORKSPACE,
                tenantIds: hasActiveTenant ? [currentTenantId] : [],
                isExportArtist: false,
                periodUnit: PERIOD_TYPE.NONE,
            });
        }
    }, [open, form, profile, activeTenantIds]);

    const getMonthFromQuarter = (quarterStr: string, isEnd: boolean) => {
        const match = quarterStr.match(/^(\d{4})-Q([1-4])$/);
        if (match) {
            const year = match[1];
            const quarter = parseInt(match[2], 10);
            if (isEnd) {
                const endMonth = quarter * 3;
                return `${year}-${String(endMonth).padStart(2, '0')}`;
            } else {
                const startMonth = (quarter - 1) * 3 + 1;
                return `${year}-${String(startMonth).padStart(2, '0')}`;
            }
        }
        return quarterStr;
    };

    const handleExport = (values: {
        dateRange: string;
        tenantIds: string[];
        splitMode: EXPORT_OPTION;
        periodUnit?: PERIOD_TYPE;
        isExportArtist?: boolean;
    }) => {
        const [startDate, endDate] = values.dateRange.split(',');

        let fromDate = startDate;
        let endDateVal = endDate;

        if (values.periodUnit === PERIOD_TYPE.QUARTER) {
            fromDate = getMonthFromQuarter(startDate, false);
            endDateVal = getMonthFromQuarter(endDate, true);
        } else {
            fromDate = dayjs(startDate).format('YYYY-MM');
            endDateVal = dayjs(endDate).format('YYYY-MM');
        }

        exportAnalyticsReport({
            payload: {
                fromDate,
                endDate: endDateVal,
                tenantIds: values.tenantIds,
                splitMode: values.splitMode,
                periodUnit: values.periodUnit,
                isExportArtist: !!values.isExportArtist,
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
            width={600}
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
                initialValues={{
                    splitMode: EXPORT_OPTION.BY_WORKSPACE,
                    tenantIds: profile?.tenantId ? [profile.tenantId] : [],
                    isExportArtist: false,
                    periodUnit: PERIOD_TYPE.NONE,
                }}
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
                        picker={
                            periodUnit === PERIOD_TYPE.QUARTER
                                ? 'quarter'
                                : 'month'
                        }
                        format={
                            periodUnit === PERIOD_TYPE.QUARTER
                                ? 'YYYY-[Q]Q'
                                : undefined
                        }
                    />
                </AppFormItem>

                <AppFormItem label={messages('analytics.splitMode.label')}>
                    <div className="flex flex-col gap-3">
                        <Form.Item
                            name="periodUnit"
                            noStyle
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.radio'),
                                },
                            ]}
                        >
                            <Radio.Group className="flex flex-wrap gap-2">
                                <Radio value={PERIOD_TYPE.NONE}>
                                    {messages('analytics.splitMode.none')}
                                </Radio>
                                <Radio value={PERIOD_TYPE.MONTH}>
                                    {messages('analytics.splitMode.month')}
                                </Radio>
                                <Radio value={PERIOD_TYPE.QUARTER}>
                                    {messages('analytics.splitMode.quarter')}
                                </Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="isExportArtist"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>
                                {messages('analytics.splitMode.isExportArtist')}
                            </Checkbox>
                        </Form.Item>
                    </div>
                </AppFormItem>

                <AppFormItem
                    name="tenantIds"
                    label={messages('tenant.selectTitle')}
                    rules={[
                        {
                            validator: (_, value) => {
                                const validValues = value?.filter((id: string) => id && activeTenantIds.includes(id)) ?? [];
                                if (!validValues.length) {
                                    return Promise.reject(
                                        new Error(messages('validation.select'))
                                    );
                                }
                                return Promise.resolve();
                            },
                        },
                    ]}
                >
                    <TenantSelectTable />
                </AppFormItem>
            </AppForm>
        </Modal>
    );
}
