import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { getIntlCodeByReleaseStatus } from '@/helpers/intl';
import { useActive } from '@/hooks/use-active';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { Card, Form, InputNumber, Select, Spin, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { useGetReleaseCiStatusSyncSchedule } from '../../hooks/use-get-release-ci-status-sync';
import {
    useRunNowReleaseCiStatusSync,
    useUpdateReleaseCiStatusSyncSchedule,
} from '../../hooks/use-update-release-ci-status-sync';
import { UpdateReleaseCiStatusSyncSchedulePayload } from '../../types';
import SyncStatusInfoCard from './sync-status-info-card';

const releaseStatusOptions = [
    RELEASES_STATUS.SUBMITTED,
    RELEASES_STATUS.PROCESSING,
    RELEASES_STATUS.DISTRIBUTED,
    RELEASES_STATUS.FAILED,
    RELEASES_STATUS.TAKEN_DOWN,
    RELEASES_STATUS.AWAITING_ACTION,
    RELEASES_STATUS.PARTIALLY_FAILED,
];

const timezoneOptions = [
    { value: 'Asia/Ho_Chi_Minh', label: 'Asia/Ho_Chi_Minh' },
    { value: 'UTC', label: 'UTC' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore' },
    { value: 'America/New_York', label: 'America/New_York' },
    { value: 'Europe/London', label: 'Europe/London' },
];

export default function SyncStatusForm() {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { schedule, isLoading } = useGetReleaseCiStatusSyncSchedule();
    const { updateSchedule, isPending: isUpdating } =
        useUpdateReleaseCiStatusSyncSchedule();
    const { runNow, isPending: isRunningNow } = useRunNowReleaseCiStatusSync();
    const { active, deActive, isActive } = useActive();
    const [cronValue, setCronValue] = useState<string>('0 6 * * *');

    useEffect(() => {
        if (schedule) {
            setCronValue(schedule.cronExpression ?? '0 6 * * *');
            form.setFieldsValue({
                syncStatusEnabled: schedule.syncStatusEnabled ?? false,
                timezone: schedule.timezone ?? 'Asia/Ho_Chi_Minh',
                releaseStatuses: schedule.releaseStatuses ?? [
                    RELEASES_STATUS.SUBMITTED,
                    RELEASES_STATUS.PROCESSING,
                ],
                batchSize: schedule.batchSize ?? 100,
                concurrency: schedule.concurrency ?? 3,
            });
        }
    }, [schedule, form]);

    const onFinish = (values: UpdateReleaseCiStatusSyncSchedulePayload) => {
        active();
        updateSchedule({
            payload: {
                ...values,
                cronExpression: cronValue,
            },
            onSuccess: () => deActive(),
            onError: () => deActive(),
        });
    };

    const handleRunNow = () => {
        runNow();
    };

    const isSubmitting = isActive || isUpdating;

    return (
        <Spin spinning={isLoading}>
            <SyncStatusInfoCard
                schedule={schedule}
                isRunNowLoading={isRunningNow}
                onRunNow={handleRunNow}
            />

            <Card className="!mt-4 rounded-lg shadow-sm">
                <AppForm
                    form={form}
                    onFinish={onFinish}
                    disabled={isSubmitting}
                    submitProps={{ loading: isSubmitting }}
                    layout="vertical"
                >
                    <AppFormItem
                        name="syncStatusEnabled"
                        label={messages('setting.syncStatus.enableSync')}
                        valuePropName="checked"
                        className="mb-6"
                    >
                        <Switch />
                    </AppFormItem>

                    <AppFormItem
                        label={messages('setting.syncStatus.cronExpression')}
                    >
                        <Cron
                            value={cronValue}
                            setValue={setCronValue}
                            clearButtonProps={{ type: 'default' }}
                            disabled={isSubmitting}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="timezone"
                        label={messages('setting.syncStatus.timezone')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Select
                            showSearch
                            disabled={isSubmitting}
                            placeholder="Asia/Ho_Chi_Minh"
                            options={timezoneOptions}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="releaseStatuses"
                        label={messages('setting.syncStatus.targetStatuses')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            mode="multiple"
                            placeholder={messages('validation.select')}
                            disabled={isSubmitting}
                            options={releaseStatusOptions.map((st) => ({
                                value: st,
                                label: messages(getIntlCodeByReleaseStatus(st)),
                            }))}
                        />
                    </AppFormItem>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <AppFormItem
                            name="batchSize"
                            label={messages('setting.syncStatus.batchSize')}
                            tooltipInfo={messages(
                                'setting.syncStatus.batchSizeTooltip'
                            )}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={1}
                                max={500}
                                disabled={isSubmitting}
                            />
                        </AppFormItem>

                        <AppFormItem
                            name="concurrency"
                            label={messages('setting.syncStatus.concurrency')}
                            tooltipInfo={messages(
                                'setting.syncStatus.concurrencyTooltip'
                            )}
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <InputNumber
                                className="!w-full"
                                min={1}
                                max={10}
                                disabled={isSubmitting}
                            />
                        </AppFormItem>
                    </div>
                </AppForm>
            </Card>
        </Spin>
    );
}
