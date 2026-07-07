import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import { Button, Form, Input, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Cron } from 'react-js-cron';
import 'react-js-cron/dist/styles.css';
import {
    useRefreshCiToolToken,
    useTestCiToken,
} from '../../hooks/use-ci-token-actions';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function PartnersForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { refreshCiToolToken, isPending: isRefreshingCiToolToken } =
        useRefreshCiToolToken();
    const { testCiToken, isPending: isTestingCiToken } = useTestCiToken();
    const { active, deActive, isActive } = useActive();
    const partnersConfigData = settingConfig?.partners;
    const [dailySendCronValue, setDailySendCronValue] = useState<string>(
        partnersConfigData?.ci?.dailySendCron ?? ''
    );

    const onFinish = (values: any) => {
        try {
            active();
            const payload: UpdateSettingPayload = {
                partners: {
                    ...values,
                    ci: {
                        ...values.ci,
                        dailySendCron: dailySendCronValue,
                    },
                },
            };
            updateSetting({
                payload,
                onSuccess: () => {
                    deActive();
                },
                onError: () => {
                    deActive();
                },
            });
        } catch (error) {
            deActive();
        }
    };

    useEffect(() => {
        form.setFieldsValue(partnersConfigData);
        if (partnersConfigData?.ci?.dailySendCron) {
            setDailySendCronValue(partnersConfigData.ci.dailySendCron);
        } else {
            setDailySendCronValue('');
        }
    }, [form, partnersConfigData]);

    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <Typography.Title level={5}>Spotify</Typography.Title>
                <div className="pl-4">
                    <AppFormItem
                        name={['spotify', 'token']}
                        label={'Token'}
                        rules={[
                            {
                                max: 1000,
                                message: messages('validation.stringMax', {
                                    max: 1000,
                                    field: 'Spotify Token',
                                }),
                            },
                        ]}
                    >
                        <Input.Password />
                    </AppFormItem>
                    <AppFormItem
                        name={['spotify', 'clientId']}
                        label={'Client ID'}
                        rules={[
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: 'Spotify Client ID',
                                }),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>
                    <AppFormItem
                        name={['spotify', 'clientSecret']}
                        label={'Client Secret'}
                        rules={[
                            {
                                max: 1000,
                                message: messages('validation.stringMax', {
                                    max: 1000,
                                    field: 'Spotify Client Secret',
                                }),
                            },
                        ]}
                    >
                        <Input.Password />
                    </AppFormItem>
                </div>

                <Typography.Title level={5} className="!mt-8">
                    Vevo
                </Typography.Title>
                <div className="pl-4">
                    <AppFormItem
                        name={['vevo', 'token']}
                        label={'Token'}
                        rules={[
                            {
                                max: 1000,
                                message: messages('validation.stringMax', {
                                    max: 1000,
                                    field: 'Vevo Token',
                                }),
                            },
                        ]}
                    >
                        <Input.Password />
                    </AppFormItem>
                    <AppFormItem
                        name={['vevo', 'baseUrl']}
                        label={'Base URL'}
                        rules={[
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: 'Vevo Base URL',
                                }),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>
                    <AppFormItem
                        name={['vevo', 'callbackUrl']}
                        label={'Callback URL'}
                        rules={[
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: 'Vevo Callback URL',
                                }),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>
                </div>

                <div className="!mt-8 flex items-center justify-between gap-3">
                    <Typography.Title level={5} className="!mb-0">
                        CI
                    </Typography.Title>
                    <Space>
                        <Button
                            type="default"
                            loading={isRefreshingCiToolToken}
                            disabled={isActive || isTestingCiToken}
                            onClick={() => refreshCiToolToken()}
                        >
                            Refresh cache
                        </Button>
                        <Button
                            type="default"
                            loading={isTestingCiToken}
                            disabled={isActive || isRefreshingCiToolToken}
                            onClick={() => testCiToken()}
                        >
                            Test
                        </Button>
                    </Space>
                </div>
                <div className="pl-4">
                    <AppFormItem label={'Daily Send Cron'}>
                        <Cron
                            value={dailySendCronValue}
                            setValue={setDailySendCronValue}
                            clearButtonProps={{ type: 'default' }}
                            disabled={isActive}
                        />
                    </AppFormItem>

                    <AppFormItem
                        name={['ci', 'baseUrl']}
                        label={'Base URL'}
                        rules={[
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: 'CI Base URL',
                                }),
                            },
                        ]}
                    >
                        <Input />
                    </AppFormItem>
                    <AppFormItem
                        name={['ci', 'token']}
                        label={'Token'}
                        rules={[
                            {
                                max: 1000,
                                message: messages('validation.stringMax', {
                                    max: 1000,
                                    field: 'CI Token',
                                }),
                            },
                        ]}
                    >
                        <Input.Password />
                    </AppFormItem>
                </div>
            </AppForm>
        </div>
    );
}
