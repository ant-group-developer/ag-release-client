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

export default function GeneratorForm({}: Props) {
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
                    name="chatId"
                    label="123"
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
                                field: 'Chat ID',
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
