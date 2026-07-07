'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { Button, Card, Form, Input, InputNumber, Spin, Switch, Modal, Checkbox } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import { useGetImportJobStatus } from '../../hooks/use-get-import-job-status';
import {
    useGetSpotifyR2SyncConfig,
    useSyncSpotifyR2,
    useUpdateSpotifyR2SyncConfig,
    useExportSpotifyTrigger,
} from '../../hooks/use-spotify-r2-sync-config';
import { RUNNING_IMPORT_JOB_STATUSES } from '../../types/payload';
import SpotifyR2SyncProgress from './spotify-r2-sync-progress';

export default function SpotifyR2SyncCard() {
    const messages = useTranslations();

    // Form & Cron state for R2 Sync
    const [r2Form] = Form.useForm();
    const [r2CronValue, setR2CronValue] = useState<string>('15 10 * * *');

    // States for progress tracking
    const [jobId, setJobId] = useState<string | null>(null);

    // Hooks for R2 Sync
    const { spotifyR2SyncConfigData, isLoading: isGetR2Loading } =
        useGetSpotifyR2SyncConfig();
    const { updateSpotifyR2SyncConfig, isPending: isUpdatingR2 } =
        useUpdateSpotifyR2SyncConfig();
    const { syncSpotifyR2, isPending: isSyncing } = useSyncSpotifyR2();
    const { exportSpotifyTrigger, isPending: isExporting } = useExportSpotifyTrigger();

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [forceExport, setForceExport] = useState(false);

    const { jobStatus, error: jobError } = useGetImportJobStatus(
        jobId as string
    );

    const isJobProcessing = !!(
        jobStatus?.status &&
        RUNNING_IMPORT_JOB_STATUSES.includes(jobStatus.status)
    );

    // Load initial values for R2 Sync Form
    useEffect(() => {
        if (spotifyR2SyncConfigData) {
            r2Form.setFieldsValue({
                enabled: spotifyR2SyncConfigData.enabled,
                prefix: spotifyR2SyncConfigData.prefix,
                retentionDays: spotifyR2SyncConfigData.retentionDays,
            });
            if (spotifyR2SyncConfigData.cron) {
                setR2CronValue(spotifyR2SyncConfigData.cron);
            }
        }
    }, [spotifyR2SyncConfigData, r2Form]);

    const onFinishR2Config = (values: any) => {
        const payload = {
            enabled: !!values.enabled,
            cron: r2CronValue,
            prefix: values.prefix || '',
            retentionDays: values.retentionDays || 0,
        };
        updateSpotifyR2SyncConfig({ payload });
    };

    const handleSyncNow = () => {
        syncSpotifyR2({
            onSuccess: (res: any) => {
                const startJobId = res?.data?.jobId;
                if (startJobId) {
                    setJobId(startJobId);
                }
            },
        });
    };

    const handleExportTrigger = () => {
        exportSpotifyTrigger({
            payload: { force: forceExport },
            onSuccess: (res: any) => {
                const startJobId = res?.data?.jobId;
                if (startJobId) {
                    setJobId(startJobId);
                }
                setIsExportModalOpen(false);
            },
        });
    };

    return (
        <Card title={messages('reportConfigs.spotifyR2SyncConfig.title')}>
            <Spin spinning={isGetR2Loading || isUpdatingR2}>
                <AppForm
                    form={r2Form}
                    onFinish={onFinishR2Config}
                    showSubmit={false}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    disabled={isUpdatingR2}
                >
                    <AppFormItem
                        name="enabled"
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.enabled'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="prefix"
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.prefix'
                        )}
                        tooltipInfo={messages(
                            'reportConfigs.spotifyR2SyncConfig.prefixTooltip'
                        )}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder="spotify-reports/"
                            style={{ width: '100%', maxWidth: 600 }}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="retentionDays"
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.retentionDays'
                        )}
                        tooltipInfo={messages(
                            'reportConfigs.spotifyR2SyncConfig.retentionDaysTooltip'
                        )}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <InputNumber
                            min={1}
                            style={{ width: '100%', maxWidth: 600 }}
                        />
                    </AppFormItem>

                    <AppFormItem
                        label={messages(
                            'reportConfigs.spotifyR2SyncConfig.cron'
                        )}
                        required
                    >
                        <div style={{ maxWidth: 600 }}>
                            <Cron
                                value={r2CronValue}
                                setValue={setR2CronValue}
                                clearButtonProps={{ type: 'default' }}
                                disabled={isUpdatingR2}
                            />
                        </div>
                    </AppFormItem>

                    <AppFormItem
                        wrapperCol={{
                            xs: 24,
                            md: { span: 18, offset: 6 },
                        }}
                        style={{
                            marginTop: 24,
                            marginBottom: 0,
                            textAlign: 'right',
                        }}
                    >
                        <Button
                            type="default"
                            onClick={() => setIsExportModalOpen(true)}
                            disabled={isUpdatingR2 || isJobProcessing}
                            style={{ minWidth: 120, marginRight: 8 }}
                        >
                            {messages(
                                'reportConfigs.spotifyR2SyncConfig.exportNow'
                            )}
                        </Button>
                        <Button
                            type="default"
                            onClick={handleSyncNow}
                            loading={isSyncing}
                            disabled={isUpdatingR2 || isJobProcessing}
                            style={{ minWidth: 120, marginRight: 8 }}
                        >
                            {messages(
                                'reportConfigs.spotifyR2SyncConfig.syncNow'
                            )}
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isUpdatingR2}
                            disabled={isSyncing || isJobProcessing}
                            style={{ minWidth: 120 }}
                        >
                            {messages('reportConfigs.spotifyR2SyncConfig.save')}
                        </Button>
                    </AppFormItem>
                </AppForm>
                {jobStatus && <SpotifyR2SyncProgress jobStatus={jobStatus} />}

                <Modal
                    title={messages(
                        'reportConfigs.spotifyR2SyncConfig.exportModalTitle'
                    )}
                    open={isExportModalOpen}
                    onCancel={() => setIsExportModalOpen(false)}
                    onOk={handleExportTrigger}
                    confirmLoading={isExporting}
                    destroyOnClose
                >
                    <div style={{ padding: '12px 0' }}>
                        <p style={{ marginBottom: 16 }}>
                            {messages(
                                'reportConfigs.spotifyR2SyncConfig.exportModalDesc'
                            )}
                        </p>
                        <Checkbox
                            checked={forceExport}
                            onChange={(e) => setForceExport(e.target.checked)}
                        >
                            {messages(
                                'reportConfigs.spotifyR2SyncConfig.forceLabel'
                            )}
                        </Checkbox>
                    </div>
                </Modal>
            </Spin>
        </Card>
    );
}
