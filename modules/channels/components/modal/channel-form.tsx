import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import { showNotification } from '@/helpers/messages-helper';
import { useActive } from '@/hooks/use-active';
import { useIsMobile } from '@/hooks/use-is-mobile';
import useModalStore from '@/hooks/use-modal';
import { CreateVariables, UpdateVariables } from '@/types/api';
import { Form, Tabs, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { CHANNEL_FORM_TAB } from '../../enums';
import { useCreateChannel } from '../../hooks/use-create-channel';
import { useTransferChannel } from '../../hooks/use-transfer-channel';
import { useUpdateChannel } from '../../hooks/use-update-channel';
import { ChannelTransferPreview, ChannelsData } from '../../types';
import {
    CreateChannelPayload,
    UpdateChannelPayload,
} from '../../types/payload';
import ChannelAccessTab from './channel-access-tab';
import ChannelInfoForm from './channel-info-form';

type ChannelFormValues = Omit<
    UpdateChannelPayload,
    'effectiveDate' | 'revenueEffectiveFrom'
> & {
    effectiveDate?: Dayjs;
    revenueEffectiveFrom?: Dayjs;
};

type Props = Omit<AppModalProps, 'children'> & {};

const PROBE_DATE = '2099-01-01';

export default function ChannelFormModal({ ...props }: Props) {
    const messages = useTranslations();
    const isMobile = useIsMobile();
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
    const { previewTransfer, isPreviewing } = useTransferChannel();
    const tenantId = Form.useWatch('tenantId', form);
    const [transferPreview, setTransferPreview] =
        useState<ChannelTransferPreview | null>(null);
    const tenantChanged =
        isUpdateForm && Boolean(tenantId) && tenantId !== dataEdit?.tenantId;

    useEffect(() => {
        setTransferPreview(null);
        if (!tenantChanged || !dataEdit?.id || !tenantId) return;

        let cancelled = false;
        previewTransfer({
            id: dataEdit.id,
            payload: {
                tenantId,
                effectiveDate: PROBE_DATE,
                revenueEffectiveFrom: PROBE_DATE,
            },
        })
            .then((response) => {
                if (!cancelled) {
                    setTransferPreview(
                        response.data.data as ChannelTransferPreview
                    );
                }
            })
            .catch(() => {
                if (!cancelled) setTransferPreview(null);
            });

        return () => {
            cancelled = true;
        };
    }, [dataEdit?.id, previewTransfer, tenantChanged, tenantId]);

    const applyFromStart = () => {
        const viewsFrom =
            transferPreview?.maxCurrentEffectiveFrom || '1900-01-01';
        const revenueFrom =
            transferPreview?.maxCurrentRevenueEffectiveFrom || '1900-01-01';
        form.setFieldsValue({
            effectiveDate: dayjs(viewsFrom).add(1, 'day'),
            revenueEffectiveFrom: dayjs(revenueFrom)
                .add(1, 'month')
                .startOf('month'),
        });
    };

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
        const tenantChanged = values.tenantId !== dataEdit?.tenantId;
        const payload: UpdateChannelPayload = {
            ...values,
            effectiveDate:
                tenantChanged && values.effectiveDate
                    ? values.effectiveDate.format('YYYY-MM-DD')
                    : undefined,
            revenueEffectiveFrom:
                tenantChanged && values.revenueEffectiveFrom
                    ? values.revenueEffectiveFrom
                          .startOf('month')
                          .format('YYYY-MM-DD')
                    : undefined,
        };
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
                    originalTenantId={dataEdit?.tenantId}
                    transferPreview={transferPreview}
                    isTransferPreviewing={isPreviewing}
                    onApplyFromStart={applyFromStart}
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
            centered={!isMobile}
            width={isMobile ? 'calc(100vw - 32px)' : '50vw'}
            style={isMobile ? { maxWidth: '100vw', top: 16 } : undefined}
            styles={{
                body: {
                    maxHeight: isMobile ? 'calc(100vh - 160px)' : '75vh',
                    overflowY: 'auto',
                    overflowX: 'hidden',
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
