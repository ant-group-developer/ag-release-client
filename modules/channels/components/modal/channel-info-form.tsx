import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { FALLBACK_IMAGE } from '@/constants/common';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { getAvatarUrl } from '@/helpers/avatar-tailwind';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
    Button,
    DatePicker,
    Form,
    FormInstance,
    Image,
    Input,
    Switch,
    Tooltip,
} from 'antd';
import { useTranslations } from 'next-intl';
import {
    CHANNEL_THUMB_URL_MAX_LENGTH,
    YOUTUBE_CHANNEL_ID_LENGTH,
} from '../../constants';
import { ChannelTransferPreview } from '../../types';

type Props = {
    form: FormInstance;
    onFinish: (values: any) => void;
    isUpdateForm: boolean;
    originalTenantId?: string;
    transferPreview?: ChannelTransferPreview | null;
    isTransferPreviewing?: boolean;
    onApplyFromStart?: () => void;
    isActive: boolean;
};

export default function ChannelInfoForm({
    form,
    onFinish,
    isUpdateForm,
    originalTenantId,
    transferPreview,
    isTransferPreviewing,
    onApplyFromStart,
    isActive,
}: Props) {
    const messages = useTranslations();
    const { isAdmin } = useAuth();
    const thumbUrl = Form.useWatch('thumbUrl', form);
    const tenantId = Form.useWatch('tenantId', form);
    const tenantChanged =
        isUpdateForm && Boolean(tenantId) && tenantId !== originalTenantId;

    const handleFinish = (values: any) => {
        const payloadValues = {
            ...values,
            youtubeChannelId: values?.youtubeChannelId?.trim() || undefined,
            thumbUrl: values?.thumbUrl
                ? values.thumbUrl
                : getAvatarUrl(values?.name || ''),
        };
        onFinish(payloadValues);
    };

    return (
        <AppForm
            form={form}
            showSubmit={false}
            onFinish={handleFinish}
            layout="vertical"
            disabled={isActive}
        >
            <AppFormItem
                name="tenantId"
                label={messages('tenant.label')}
                required
                extra={
                    isUpdateForm
                        ? messages('channel.transfer.changeWorkspaceHint')
                        : undefined
                }
                rules={[
                    {
                        required: true,
                        message: messages('validation.input'),
                    },
                ]}
            >
                <TenantSelectActive
                    placeholder={messages('tenant.selectTitle')}
                    disabled={isActive}
                />
            </AppFormItem>

            {tenantChanged && (
                <>
                    <div className="mb-3">
                        <Tooltip
                            title={messages('channel.transfer.fromStartHelp')}
                        >
                            <Button
                                size="small"
                                loading={isTransferPreviewing}
                                disabled={
                                    !transferPreview ||
                                    Boolean(
                                        transferPreview.blockingSharedIsrcs
                                            ?.length
                                    )
                                }
                                onClick={onApplyFromStart}
                            >
                                {messages('channel.transfer.fromStart')}
                            </Button>
                        </Tooltip>
                    </div>
                    <AppFormItem
                        name="effectiveDate"
                        label={messages('channel.transfer.effectiveDate')}
                        required
                        tooltipInfo={messages(
                            'channel.transfer.effectiveDateHelp'
                        )}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <DatePicker
                            className="w-full"
                            format="YYYY-MM-DD"
                            placeholder={messages(
                                'channel.transfer.selectDate'
                            )}
                        />
                    </AppFormItem>
                    <AppFormItem
                        name="revenueEffectiveFrom"
                        label={messages(
                            'channel.transfer.revenueEffectiveFrom'
                        )}
                        required
                        tooltipInfo={messages(
                            'channel.transfer.revenueEffectiveFromHelp'
                        )}
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <DatePicker
                            className="w-full"
                            picker="month"
                            format="MM/YYYY"
                            placeholder={messages(
                                'channel.transfer.selectMonth'
                            )}
                        />
                    </AppFormItem>
                </>
            )}

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
                        min: 2,
                        message: messages('validation.stringMin', {
                            min: 2,
                            field: messages('channel.name'),
                        }),
                    },
                    {
                        whitespace: true,
                        message: messages('validation.input'),
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
                    disabled={(!isAdmin && isUpdateForm) || isActive}
                />
            </AppFormItem>

            <AppFormItem
                name="youtubeChannelId"
                label={messages('channel.youtubeChannelId')}
                rules={[
                    {
                        min: YOUTUBE_CHANNEL_ID_LENGTH,
                        max: YOUTUBE_CHANNEL_ID_LENGTH,
                        message: messages('validation.mustBeLength', {
                            number: YOUTUBE_CHANNEL_ID_LENGTH,
                            field: messages('channel.youtubeChannelId'),
                        }),
                    },
                ]}
            >
                <Input
                    placeholder="UC..."
                    allowClear
                    disabled={(!isAdmin && isUpdateForm) || isActive}
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

            {thumbUrl && (
                <div className="mb-4 flex items-center gap-3">
                    <Image
                        src={thumbUrl}
                        alt="Thumbnail preview"
                        width={80}
                        height={80}
                        className="rounded-lg border border-solid object-cover"
                        fallback={FALLBACK_IMAGE}
                        preview={{
                            maskClassName: 'rounded-lg',
                        }}
                    />
                </div>
            )}

            {!isUpdateForm && (
                <AppFormItem
                    name="existedOnVevoBackstage"
                    label={messages('channel.existedOnVevoBackstage')}
                    valuePropName="checked"
                >
                    <Switch disabled={isActive} />
                </AppFormItem>
            )}

            <AppFormItem
                name="isActive"
                label={messages('common.isActive')}
                valuePropName="checked"
            >
                <Switch disabled={isActive} />
            </AppFormItem>
        </AppForm>
    );
}
