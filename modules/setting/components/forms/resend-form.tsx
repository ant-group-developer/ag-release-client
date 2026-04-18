import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function ResendForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingConfig } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const resendConfigData = settingConfig?.resend;

    const onFinish = (values: any) => {
        try {
            active();
            const payload: UpdateSettingPayload = {
                resend: {
                    ...values,
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
        form.setFieldsValue({ ...resendConfigData });
    }, [form, resendConfigData]);

    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem
                    name="email"
                    label={'Email'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            type: 'email',
                            message: messages('validation.email'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: 'Email',
                            }),
                        },
                    ]}
                >
                    <Input type="email" />
                </AppFormItem>
                <AppFormItem
                    name="apiKey"
                    label="API Key"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: MAX_NAME_LENGTH,
                            message: messages('validation.stringMax', {
                                max: MAX_NAME_LENGTH,
                                field: 'API Key',
                            }),
                        },
                    ]}
                >
                    <Input.Password />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
