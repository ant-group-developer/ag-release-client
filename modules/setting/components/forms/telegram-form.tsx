import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useActive } from '@/hooks/use-active';
import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useGetSetting } from '../../hooks/use-get-setting';
import { useUpdateSetting } from '../../hooks/use-update-role';
import { UpdateSettingPayload } from '../../types/payload';

type Props = {};

export default function TelegramForm({}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const { settingData } = useGetSetting();
    const { updateSetting } = useUpdateSetting();
    const { active, deActive, isActive } = useActive();
    const telegramConfigData = settingData?.telegram;

    const onFinish = (values: any) => {
        try {
            active();
            const payload: UpdateSettingPayload = {
                telegram: {
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
        form.setFieldsValue({
            ...telegramConfigData,
        });
    }, [form, telegramConfigData]);
    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem
                    name="token"
                    label={'Token'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'Token',
                            }),
                        },
                    ]}
                >
                    <TextArea
                        autoSize={{
                            maxRows: 7,
                            minRows: 3,
                        }}
                    />
                </AppFormItem>
                <AppFormItem
                    name="chatId"
                    label="chat Id"
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'chatId',
                            }),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
