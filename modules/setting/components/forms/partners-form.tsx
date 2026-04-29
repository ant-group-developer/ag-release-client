import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import { Form, Input, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function PartnersForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const partnersConfigData = settingConfig?.partners;

    const onFinish = (values: any) => {
        try {
            active();
            const payload: UpdateSettingPayload = {
                partners: values,
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
                    CI
                </Typography.Title>
                <div className="pl-4">
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
