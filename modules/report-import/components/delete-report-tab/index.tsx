'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import LabelSelect from '@/components/ui/select/label-select';
import TenantSelect from '@/components/ui/select/tenant-select';
import { formattedNumber } from '@/helpers/common';
import { ETL_JOB_SOURCE_TYPE } from '@/modules/report-import/enums';
import { useDeleteImportedReleaseEvents } from '@/modules/report-import/hooks/use-delete-imported-release-events';
import { useDeleteImportedReleases } from '@/modules/report-import/hooks/use-delete-imported-releases';
import {
    DeleteImportedReleasesResponse,
    IMPORT_JOBS_STATUS,
} from '@/modules/report-import/types/payload';
import {
    Alert,
    Button,
    Card,
    Descriptions,
    Form,
    Input,
    Progress,
    Switch,
    Typography,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

interface DeleteReportFormValues {
    dateRange?: string;
    tenantId?: string;
    labelId?: string;
    importSourceType?: ETL_JOB_SOURCE_TYPE;
    parserCode?: string;
    fileName?: string;
    deleteAll?: boolean;
}

const resolveDeleteReportResponse = (
    response?: DeleteImportedReleasesResponse
) => {
    return response?.data || response;
};

const getProgressPercent = (progress?: { current: number; total: number }) => {
    if (!progress?.total) return 0;

    return Math.min(
        100,
        Math.max(0, Math.round((progress.current / progress.total) * 100))
    );
};

export default function DeleteReportTab() {
    const messages = useTranslations();
    const [form] = Form.useForm<DeleteReportFormValues>();
    const [jobId, setJobId] = useState<string | null>(null);

    const { deleteImportedReleases, isPending } = useDeleteImportedReleases();

    const { summary, isListening, isTerminalEvent, error } =
        useDeleteImportedReleaseEvents({
            jobId,
            enabled: !!jobId,
            onCompleted: () => {
                // optionally do something
            },
        });

    const progressPercent = useMemo(
        () => getProgressPercent(summary?.progress),
        [summary?.progress]
    );

    const isCompleted = summary?.status === IMPORT_JOBS_STATUS.COMPLETED;
    const isFailed = summary?.status === IMPORT_JOBS_STATUS.FAILED || !!error;
    const isJobStarted = !!jobId;

    const handleCancel = () => {
        if (isPending || (isListening && !isTerminalEvent)) return;
        form.resetFields();
        setJobId(null);
    };

    const handleSubmit = (values: DeleteReportFormValues) => {
        const { dateRange, ...rest } = values;
        const [fromDate, toDate] = dateRange?.split(',') || [];
        const payload: Record<string, any> = {
            ...rest,
            fromDate,
            toDate,
        };

        Object.keys(payload).forEach((key) => {
            if (
                payload[key] === null ||
                payload[key] === undefined ||
                payload[key] === ''
            ) {
                delete payload[key];
            }
        });

        deleteImportedReleases({
            payload,
            onSuccess: (response: DeleteImportedReleasesResponse) => {
                const resolvedResponse = resolveDeleteReportResponse(response);
                setJobId(
                    resolvedResponse?.jobId || resolvedResponse?.id || null
                );
            },
        });
    };

    return (
        <Card className="mx-auto w-full">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{
                    deleteAll: false,
                }}
                disabled={isPending || (isListening && !isTerminalEvent)}
            >
                <div className="grid grid-cols-1 gap-x-4 md:grid-cols-2">
                    <Form.Item
                        name="dateRange"
                        label={messages('common.timeRange')}
                        className="md:col-span-2"
                    >
                        <DateSelect2
                            allowClear
                            className="w-full"
                            showTime={{ format: 'HH:mm' }}
                            format="YYYY-MM-DD HH:mm"
                        />
                    </Form.Item>

                    <Form.Item name="tenantId" label={messages('tenant.label')}>
                        <TenantSelect
                            allowClear
                            placeholder={messages('tenant.selectTitle')}
                        />
                    </Form.Item>

                    <Form.Item name="labelId" label={messages('label.label')}>
                        <LabelSelect
                            allowClear
                            placeholder={messages('select.option')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="fileName"
                        label={messages('common.fileName')}
                    >
                        <Input
                            allowClear
                            placeholder={messages(
                                'release.deleteReport.fileNamePlaceholder'
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="deleteAll"
                        label={messages('release.deleteReport.deleteAll')}
                        valuePropName="checked"
                    >
                        <Switch />
                    </Form.Item>
                </div>

                <div className="mt-4 flex justify-end gap-3">
                    <Button
                        type="primary"
                        danger
                        loading={isPending}
                        disabled={isListening && !isTerminalEvent}
                        onClick={() => form.submit()}
                    >
                        {messages('release.deleteReport.submit')}
                    </Button>
                </div>
            </Form>

            {isJobStarted && (
                <div className="mt-4 rounded-md border border-gray-200 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <Typography.Text strong>
                            {messages('common.progress')}
                        </Typography.Text>
                        <Typography.Text type={isFailed ? 'danger' : undefined}>
                            {summary?.status || messages('common.processing')}
                        </Typography.Text>
                    </div>

                    <Progress
                        percent={progressPercent}
                        status={
                            isFailed
                                ? 'exception'
                                : isCompleted
                                  ? 'success'
                                  : 'active'
                        }
                    />

                    {summary?.progress?.label && (
                        <Typography.Paragraph className="!mb-3">
                            {summary.progress.label}
                        </Typography.Paragraph>
                    )}

                    <Descriptions column={2} size="small" bordered>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.importResult.totalRows'
                            )}
                        >
                            {formattedNumber(summary?.rows?.total || 0)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.importResult.processedRows'
                            )}
                        >
                            {formattedNumber(summary?.rows?.processed || 0)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'release.deleteReport.matchedReleases'
                            )}
                        >
                            {formattedNumber(
                                summary?.params?.matchedReleases || 0
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'release.deleteReport.matchedTracks'
                            )}
                        >
                            {formattedNumber(
                                summary?.params?.matchedTracks || 0
                            )}
                        </Descriptions.Item>
                    </Descriptions>

                    {(summary?.error || error) && (
                        <Alert
                            className="!mt-3"
                            type="error"
                            showIcon
                            message={
                                summary?.error ||
                                error?.message ||
                                messages('common.somethingWentWrong')
                            }
                        />
                    )}
                </div>
            )}
        </Card>
    );
}
