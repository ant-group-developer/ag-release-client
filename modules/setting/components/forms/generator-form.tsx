import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useActive } from '@/hooks/use-active';
import PrefixIsrcSelect from '@/modules/prefix-isrc/components/prefix-isrc-select';
import PrefixUpcSelect from '@/modules/prefix-upc/components/prefix-isrc-select';
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
                    name="prefixUpcDefaultId"
                    label={'Prefix UPC'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <PrefixUpcSelect />
                </AppFormItem>

                <AppFormItem
                    name="prefixIsrcDefaultId"
                    label={'Prefix ISRC'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <PrefixIsrcSelect />
                </AppFormItem>

                <AppFormItem
                    name="API_KEY_GRPC_ISRC_UPC"
                    label={'API Key'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>

                <AppFormItem
                    name="DDEX_PARTY_ID_SENDER"
                    label={'DDEX party Id'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>

                <AppFormItem
                    name="DDEX_PARTY_NAME_SENDER"
                    label={'DDEX party name'}
                    required
                    rules={[
                        {
                            required: true,
                            message: messages('validation.input'),
                        },
                    ]}
                >
                    <Input />
                </AppFormItem>
            </AppForm>
        </div>
    );
}
