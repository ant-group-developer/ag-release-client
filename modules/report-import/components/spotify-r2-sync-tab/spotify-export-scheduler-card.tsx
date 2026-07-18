'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppSwitch from '@/components/ui/switch/status-switch';
import {
    Button,
    Card,
    Form,
    Spin,
    Switch,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import {
    useGetSpotifyExportSchedulerConfig,
    useUpdateSpotifyExportSchedulerConfig,
} from '../../hooks/use-spotify-r2-sync-config';

export default function SpotifyExportSchedulerCard() {
    const messages = useTranslations();

    // Form & Cron state for Export Scheduler
    const [exportForm] = Form.useForm();
    const [exportCronValue, setExportCronValue] =
        useState<string>('0 10 * * *');

    // Hooks for Export Scheduler
    const { spotifyExportSchedulerConfigData, isLoading: isGetExportLoading } =
        useGetSpotifyExportSchedulerConfig();
    const { updateSpotifyExportSchedulerConfig, isPending: isUpdatingExport } =
        useUpdateSpotifyExportSchedulerConfig();

    // Load initial values for Export Scheduler Form
    useEffect(() => {
        if (spotifyExportSchedulerConfigData) {
            exportForm.setFieldsValue({
                enabled: spotifyExportSchedulerConfigData.enabled,
                force: spotifyExportSchedulerConfigData.force,
            });
            if (spotifyExportSchedulerConfigData.cron) {
                setExportCronValue(spotifyExportSchedulerConfigData.cron);
            }
        }
    }, [spotifyExportSchedulerConfigData, exportForm]);

    const onFinishExportConfig = (values: any) => {
        const payload = {
            enabled: !!values.enabled,
            cron: exportCronValue,
            force: !!values.force,
        };
        updateSpotifyExportSchedulerConfig({ payload });
    };

    return (
        <Card
            title={messages(
                'reportConfigs.spotifyExportSchedulerConfig.title'
            )}
        >
            <Spin spinning={isGetExportLoading || isUpdatingExport}>
                <AppForm
                    form={exportForm}
                    onFinish={onFinishExportConfig}
                    showSubmit={false}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    disabled={isUpdatingExport}
                >
                    <AppFormItem
                        name="enabled"
                        label={messages(
                            'reportConfigs.spotifyExportSchedulerConfig.enabled'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages(
                                'status.disable'
                            )}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name="force"
                        label={messages(
                            'reportConfigs.spotifyExportSchedulerConfig.force'
                        )}
                        tooltipInfo={messages(
                            'reportConfigs.spotifyExportSchedulerConfig.forceTooltip'
                        )}
                        valuePropName="checked"
                    >
                        <AppSwitch />
                    </AppFormItem>

                    <AppFormItem
                        label={messages(
                            'reportConfigs.spotifyExportSchedulerConfig.cron'
                        )}
                        required
                    >
                        <div style={{ maxWidth: 600 }}>
                            <Cron
                                value={exportCronValue}
                                setValue={setExportCronValue}
                                clearButtonProps={{ type: 'default' }}
                                disabled={isUpdatingExport}
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
                            type="primary"
                            htmlType="submit"
                            loading={isUpdatingExport}
                            style={{ minWidth: 120 }}
                        >
                            {messages(
                                'reportConfigs.spotifyExportSchedulerConfig.save'
                            )}
                        </Button>
                    </AppFormItem>
                </AppForm>
            </Spin>
        </Card>
    );
}
