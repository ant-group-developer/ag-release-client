import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Tabs, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CHANNEL_FORM_TAB } from '../../enums';
import { useCreateChannel } from '../../hooks/use-create-channel';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelsData } from '../../types';
import {
    CreateChannelPayload,
    UpdateChannelPayload,
} from '../../types/payload';
import ChannelAccessTab from './channel-access-tab';
import ChannelInfoForm from './channel-info-form';

type ChannelFormValues = UpdateChannelPayload;

type Props = Omit<AppModalProps, 'children'> & {};

export default function ChannelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm<ChannelFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const dataEdit = useModalStore((state) => state.dataEdit as ChannelsData);
    const isUpdateForm = !!dataEdit?.id;
    const { active, deActive, isActive } = useActive();
    const [activeTab, setActiveTab] = useState<CHANNEL_FORM_TAB>(
        CHANNEL_FORM_TAB.INFO
    );

    const { createChannel, isPending: isCreatePending } = useCreateChannel();
    const { updateChannel, isPending: isUpdatePending } = useUpdateChannel();

    const handleFormError = (data: any) => {
        const response = data?.response?.data;
        const { channel_name, youtube_channel_id } = response?.data || {};

        let errorMsg = messages.has(response?.messageCode)
            ? messages(response?.messageCode)
            : response?.message;

        const details: string[] = [];
        if (channel_name) {
            details.push(`${messages('channel.name')}: ${channel_name}`);
        }
        if (youtube_channel_id) {
            details.push(
                `${messages('channel.youtubeChannelId')}: ${youtube_channel_id}`
            );
        }

        if (details.length > 0) {
            errorMsg = `${errorMsg} (${details.join(', ')})`;
        }

        showNotification('error', errorMsg);
        deActive();
    };

    const handleCreateChannel = (values: ChannelFormValues) => {
        const payload = {
            name: values.name,
            tenantId: values.tenantId,
            youtubeChannelId: values.youtubeChannelId,
            thumbUrl: values.thumbUrl,
            existedOnVevoBackstage: values.existedOnVevoBackstage,
            isActive: values.isActive,
        } as CreateChannelPayload;

        const variables: CreateVariables<CreateChannelPayload> = {
            payload,
            onSuccess: () => {
                form.resetFields();
                deActive();
                closeModal();
            },
            onError: handleFormError,
        };
        createChannel(variables);
    };

    const handleUpdateChannel = (values: ChannelFormValues) => {
        const { tenantId: _tenantId, ...payload } = values;
        const variables: UpdateVariables<
            ChannelsData['id'],
            UpdateChannelPayload
        > = {
            id: dataEdit?.id,
            payload,
            onSuccess: () => {
                deActive();
                closeModal();
            },
            onError: handleFormError,
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
            existedOnVevoBackstage: dataEdit?.existedOnVevoBackstage ?? false,
            isActive: dataEdit?.isActive ?? true,
        };
        form.setFieldsValue(initialData);
    }, [dataEdit, form]);

    const tabItems = [
        {
            key: CHANNEL_FORM_TAB.INFO,
            label: messages('channel.infoTab'),
            children: (
                <ChannelInfoForm
                    form={form}
                    onFinish={onfinish}
                    isUpdateForm={isUpdateForm}
                    isActive={isActive}
                />
            ),
        },
        {
            key: CHANNEL_FORM_TAB.ACCESS,
            label: !isUpdateForm ? (
                <Tooltip title={messages('channel.createFirstToManageMembers')}>
                    <span>{messages('channel.accessManagementTab')}</span>
                </Tooltip>
            ) : (
                messages('channel.accessManagementTab')
            ),
            disabled: !isUpdateForm,
            children: dataEdit?.id ? (
                <ChannelAccessTab channelId={dataEdit.id} />
            ) : null,
        },
    ];

    return (
        <AppModal
            centered
            width="50vw"
            styles={{
                body: {
                    minHeight: '60vh',
                    maxHeight: '75vh',
                    overflowY: 'auto',
                },
            }}
            {...props}
            title={modalTitle()}
            open
            onCancel={closeModal}
            onOk={activeTab === CHANNEL_FORM_TAB.INFO ? form.submit : undefined}
            footer={activeTab === CHANNEL_FORM_TAB.ACCESS ? null : undefined}
            loading={isCreatePending || isUpdatePending}
        >
            <Tabs
                activeKey={activeTab}
                onChange={(key) => setActiveTab(key as CHANNEL_FORM_TAB)}
                items={tabItems}
            />
        </AppModal>
    );
}
