import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import TenantSelect from '@/components/ui/select/tenant-select';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { CHANNEL_THUMB_URL_MAX_LENGTH } from '../../constants';
import { useCreateChannel } from '../../hooks/use-create-channel';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelsData } from '../../types';
import {
    CreateChannelPayload,
    UpdateChannelPayload,
} from '../../types/payload';

type ChannelFormValues = UpdateChannelPayload;

type Props = Omit<AppModalProps, 'children'> & {};

export default function ChannelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<ChannelFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ChannelsData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();

    const { createChannel, isPending: isCreatePending } = useCreateChannel();
    const { updateChannel, isPending: isUpdatePending } = useUpdateChannel();

    const handleCreateChannel = (values: ChannelFormValues) => {
        const payload = {
            name: values.name,
            tenantId: values.tenantId,
            youtubeChannelId: values.youtubeChannelId,
            thumbUrl: values.thumbUrl,
        } as CreateChannelPayload;

        const variables: CreateVariables<CreateChannelPayload> = {
            payload,
            onSuccess: () => {
                form.resetFields();
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        createChannel(variables);
    };

    const handleUpdateChannel = (values: ChannelFormValues) => {
        const variables: UpdateVariables<
            ChannelsData['id'],
            UpdateChannelPayload
        > = {
            id: dataEdit?.id,
            payload: values,
            onSuccess: () => {
                deActive();
            },
            onError: () => {
                deActive();
            },
        };
        updateChannel(variables);
    };

    const onfinish = async (values: ChannelFormValues) => {
        active();

        try {
            return isUpdateForm
                ? handleUpdateChannel(values)
                : handleCreateChannel(values);
        } catch (error) {
            deActive();
        }
    };

    const modalTitle = () => {
        return `${isUpdateForm ? messages('common.update') : messages('common.create')} ${messages('channel.label').toLocaleLowerCase()}`;
    };

    useEffect(() => {
        const initialData: ChannelFormValues = {
            name: dataEdit?.name,
            tenantId: dataEdit?.tenantId,
            youtubeChannelId: dataEdit?.youtubeChannelId ?? undefined,
            thumbUrl: dataEdit?.thumbUrl ?? undefined,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit, form]);

    return (
        <AppModal
            width={500}
            {...props}
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={form.submit}
            loading={isCreatePending || isUpdatePending}
        >
            <AppForm
                form={form}
                showSubmit={false}
                onFinish={onfinish}
                layout="vertical"
                disabled={isActive}
            >
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
                    <TenantSelect
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
                    <Input placeholder={messages('channel.name')} allowClear />
                </AppFormItem>

                <AppFormItem
                    name="youtubeChannelId"
                    label="YouTube channel ID"
                    rules={[
                        {
                            max: 100,
                            message: messages('validation.stringMax', {
                                max: 100,
                                field: 'YouTube channel ID',
                            }),
                        },
                    ]}
                >
                    <Input placeholder="UC..." allowClear />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
