import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import {
    Button,
    DatePicker,
    Form,
    InputNumber,
    Select,
    Spin,
    Switch,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import {
    useGetSyncConfig,
    useUpdateSyncConfig,
} from '../../hooks/use-sync-config';

export default function SyncConfigForm() {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const [cronValue, setCronValue] = useState<string>('5 9 * * *');
    const { syncConfigData, isLoading: isGetConfigLoading } =
        useGetSyncConfig();
    const { updateSyncConfig, isPending: isUpdatingConfig } =
        useUpdateSyncConfig();

    useEffect(() => {
        if (syncConfigData) {
            form.setFieldsValue({
                mode: syncConfigData.mode,
                startPeriod: syncConfigData.startPeriod
                    ? dayjs(syncConfigData.startPeriod, 'YYYYMM')
                    : null,
                categories: syncConfigData.categories || [],
                force: syncConfigData.force,
                excludeEnabled: syncConfigData.excludeEnabled,
                maxRetries: syncConfigData.maxRetries,
            });
            if (syncConfigData.cron) {
                setCronValue(syncConfigData.cron);
            }
        }
    }, [syncConfigData, form]);

    const onFinishConfig = (values: any) => {
        const payload = {
            mode: values.mode,
            cron: cronValue,
            startPeriod: values.startPeriod
                ? values.startPeriod.format('YYYYMM')
                : '',
            categories: values.categories || [],
            force: !!values.force,
            excludeEnabled: !!values.excludeEnabled,
            maxRetries: values.maxRetries || 0,
        };
        updateSyncConfig(payload);
    };

    return (
        <Spin spinning={isGetConfigLoading}>
            <AppForm form={form} onFinish={onFinishConfig} showSubmit={false}>
                <AppFormItem
                    name="mode"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.mode'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.select'),
                        },
                    ]}
                >
                    <Select
                        options={[
                            { label: 'Auto', value: 'auto' },
                            { label: 'Manual', value: 'manual' },
                        ]}
                        style={{ width: '100%', maxWidth: 600 }}
                    />
                </AppFormItem>

                <AppFormItem
                    name="startPeriod"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.startPeriod'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages(
                                'reportConfigs.sftpExcludePatterns.sync.requiredStartPeriod'
                            ),
                        },
                    ]}
                >
                    <DatePicker
                        picker="month"
                        format="MM/YYYY"
                        style={{ width: '100%', maxWidth: 600 }}
                    />
                </AppFormItem>

                <AppFormItem
                    name="categories"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.categories'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages(
                                'reportConfigs.sftpExcludePatterns.sync.requiredCategories'
                            ),
                        },
                    ]}
                >
                    <Select
                        mode="multiple"
                        placeholder={messages(
                            'reportConfigs.sftpExcludePatterns.sync.categoriesPlaceholder'
                        )}
                        options={[
                            {
                                label: messages(
                                    'reportConfigs.sftpExcludePatterns.sync.salesLabel'
                                ),
                                value: 'sales',
                            },
                            {
                                label: messages(
                                    'reportConfigs.sftpExcludePatterns.sync.trendsLabel'
                                ),
                                value: 'trends',
                            },
                        ]}
                        style={{ width: '100%', maxWidth: 600 }}
                    />
                </AppFormItem>

                <AppFormItem
                    name="maxRetries"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.maxRetries'
                    )}
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <InputNumber
                        min={0}
                        max={10}
                        style={{ width: '100%', maxWidth: 600 }}
                    />
                </AppFormItem>

                <AppFormItem
                    name="force"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.force'
                    )}
                    valuePropName="checked"
                >
                    <Switch />
                </AppFormItem>

                <AppFormItem
                    name="excludeEnabled"
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.excludeEnabled'
                    )}
                    valuePropName="checked"
                >
                    <Switch />
                </AppFormItem>

                <AppFormItem
                    label={messages(
                        'reportConfigs.sftpExcludePatterns.syncConfig.cron'
                    )}
                >
                    <Cron
                        value={cronValue}
                        setValue={setCronValue}
                        clearButtonProps={{ type: 'default' }}
                        disabled={isUpdatingConfig}
                    />
                </AppFormItem>

                <AppFormItem
                    wrapperCol={{
                        xs: 24,
                        md: { span: 19, offset: 5 },
                        lg: { span: 20, offset: 4 },
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
                        loading={isUpdatingConfig}
                        style={{ minWidth: 120 }}
                    >
                        {messages(
                            'reportConfigs.sftpExcludePatterns.syncConfig.save'
                        )}
                    </Button>
                </AppFormItem>
            </AppForm>
        </Spin>
    );
}
