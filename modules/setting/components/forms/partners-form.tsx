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
                partners: {
                    spotify: {
                        token: values.spotifyToken,
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
        form.setFieldsValue({
            spotifyToken: partnersConfigData?.spotify?.token,
        });
    }, [form, partnersConfigData]);

    return (
        <div>
            <AppForm
                form={form}
                onFinish={onFinish}
                disabled={isActive}
                submitProps={{ loading: isActive }}
            >
                <AppFormItem
                    name="spotifyToken"
                    label={'Spotify Token'}
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
            </AppForm>
        </div>
    );
}
