import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { FormInstance, Input, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import { CHANNEL_THUMB_URL_MAX_LENGTH } from '../../constants';

type Props = {
    form: FormInstance;
    onFinish: (values: any) => void;
    isUpdateForm: boolean;
    isActive: boolean;
};

export default function ChannelInfoForm({
    form,
    onFinish,
    isUpdateForm,
    isActive,
}: Props) {
    const messages = useTranslations();

    return (
        <AppForm
            form={form}
            showSubmit={false}
            onFinish={onFinish}
            layout="vertical"
            disabled={isActive}
        >
            <AppFormItem
                name="tenantId"
                label={messages('tenant.label')}
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.input'),
                    },
                ]}
            >
                <TenantSelectActive
                    placeholder={messages('tenant.selectTitle')}
                />
            </AppFormItem>

            <AppFormItem
                name="name"
                label={messages('channel.name')}
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
                            field: messages('channel.name'),
                        }),
                    },
                    {
                        pattern: /^[A-Za-z0-9]+VEVO$/,
                        message: messages('channel.validation.nameFormat'),
                    },
                ]}
            >
                <Input
                    placeholder={messages('channel.name')}
                    allowClear
                    disabled={isUpdateForm || isActive}
                />
            </AppFormItem>

            <AppFormItem
                name="youtubeChannelId"
                label={messages('channel.youtubeChannelId')}
                rules={[
                    {
                        max: 100,
                        message: messages('validation.stringMax', {
                            max: 100,
                            field: messages('channel.youtubeChannelId'),
                        }),
                    },
                ]}
            >
                <Input
                    placeholder="UC..."
                    allowClear
                    disabled={isUpdateForm || isActive}
                />
            </AppFormItem>

            <AppFormItem
                name="thumbUrl"
                label={messages('common.thumbnailUrl')}
                rules={[
                    {
                        type: 'url',
                        message: messages('validation.url'),
                    },
                    {
                        max: CHANNEL_THUMB_URL_MAX_LENGTH,
                        message: messages('validation.stringMax', {
                            max: CHANNEL_THUMB_URL_MAX_LENGTH,
                            field: messages('common.thumbnailUrl'),
                        }),
                    },
                ]}
            >
                <Input
                    placeholder="https://..."
                    allowClear
                    disabled={isActive}
                />
            </AppFormItem>

            {!isUpdateForm && (
                <AppFormItem
                    name="existedOnVevoBackstage"
                    label={messages('channel.existedOnVevoBackstage')}
                    valuePropName="checked"
                >
                    <Switch disabled={isActive} />
                </AppFormItem>
            )}
        </AppForm>
    );
}
