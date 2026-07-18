'use client';

import DateSelect2 from '@/components/ui/select/date-select2';
import LabelSelect from '@/components/ui/select/label-select';
import TenantSelect from '@/components/ui/select/tenant-select';
import { useDeleteImportedReleaseEvents } from '@/modules/report-import/hooks/use-delete-imported-release-events';
import { useDeleteImportedReleases } from '@/modules/report-import/hooks/use-delete-imported-releases';
import { DeleteImportedReleasesResponse } from '@/modules/report-import/types/payload';
import { Button, Card, Form, Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { ETL_JOB_SOURCE_TYPE } from '../../enums';
import DeleteJobProgress from './delete-job-progress';

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

    // Progress logic is now encapsulated inside DeleteJobProgress

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

            <DeleteJobProgress jobId={jobId} summary={summary} error={error} />
        </Card>
    );
}
