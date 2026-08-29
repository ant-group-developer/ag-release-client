'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import TenantSelectActive from '@/components/ui/select/tenant-select-active';
import { showNotification } from '@/helpers/messages-helper';
import { useApiNotify } from '@/hooks/use-api-notify';
import useModalStore from '@/hooks/use-modal';
import { Alert, Button, DatePicker, Form, Tooltip } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useTransferChannel } from '../../hooks/use-transfer-channel';
import { ChannelTransferModalData, ChannelTransferPreview } from '../../types';

type TransferFormValues = {
    tenantId: string;
    effectiveDate: Dayjs;
    revenueEffectiveFrom: Dayjs;
};

const PROBE_DATE = '2099-01-01';

function earliestViewsDate(from: string) {
    return dayjs(from).add(1, 'day');
}

function earliestRevenueMonth(from: string) {
    return dayjs(from).add(1, 'month').startOf('month');
}

export default function ChannelTransferModal() {
    const messages = useTranslations();
    const [form] = Form.useForm<TransferFormValues>();
    const closeModal = useModalStore((state) => state.closeModal);
    const channel = useModalStore(
        (state) => state.dataEdit as ChannelTransferModalData
    );
    const { previewTransfer, transferChannel, isPreviewing, isTransferring } =
        useTransferChannel();
    const { handleError } = useApiNotify();
    const [preview, setPreview] = useState<ChannelTransferPreview | null>(
        null
    );
    const tenantId = Form.useWatch('tenantId', form);
    const sharedIsrcs = preview?.blockingSharedIsrcs ?? [];
    const hasSharedIsrc = sharedIsrcs.length > 0;

    useEffect(() => {
        form.setFieldsValue({
            tenantId: channel?.destTenantId || channel?.tenantId,
        });
        setPreview(null);
    }, [channel, form]);

    useEffect(() => {
        if (!channel?.id || !tenantId) return;

        let cancelled = false;
        previewTransfer({
            id: channel.id,
            payload: {
                tenantId,
                effectiveDate: PROBE_DATE,
                revenueEffectiveFrom: PROBE_DATE,
            },
        })
            .then((res) => {
                if (cancelled) return;
                setPreview(res.data.data as ChannelTransferPreview);
            })
            .catch(() => {
                if (!cancelled) setPreview(null);
            });

        return () => {
            cancelled = true;
        };
    }, [channel?.id, tenantId, previewTransfer]);

    const applyFromStart = () => {
        const viewsFrom =
            preview?.maxCurrentEffectiveFrom || '1900-01-01';
        const revenueFrom =
            preview?.maxCurrentRevenueEffectiveFrom || '1900-01-01';
        form.setFieldsValue({
            effectiveDate: earliestViewsDate(viewsFrom),
            revenueEffectiveFrom: earliestRevenueMonth(revenueFrom),
        });
    };

    const handleOk = async () => {
        if (hasSharedIsrc) return;
        const values = await form.validateFields();
        const payload = {
            tenantId: values.tenantId,
            effectiveDate: values.effectiveDate.format('YYYY-MM-DD'),
            revenueEffectiveFrom: values.revenueEffectiveFrom
                .startOf('month')
                .format('YYYY-MM-DD'),
        };

        try {
            const previewRes = await previewTransfer({
                id: channel.id,
                payload,
            });
            const nextPreview = previewRes.data.data as ChannelTransferPreview;

            if (nextPreview.blockingSharedIsrcs?.length) {
                setPreview(nextPreview);
                return;
            }
            if (nextPreview.blockingReleases?.length) {
                showNotification(
                    'error',
                    messages('channel.transfer.dateNotAfter', {
                        views: nextPreview.maxCurrentEffectiveFrom,
                        revenue: nextPreview.maxCurrentRevenueEffectiveFrom,
                    })
                );
                return;
            }

            transferChannel({
                id: channel.id,
                payload,
                onSuccess: () => {
                    form.resetFields();
                    closeModal();
                },
            });
        } catch (error) {
            handleError(error);
        }
    };

    const sharedIsrcList = [
        ...new Set(sharedIsrcs.map((item) => item.isrc)),
    ].join(', ');

    return (
        <AppModal
            open
            centered
            title={`${messages('channel.transfer.title')} — ${channel?.name ?? ''}`}
            onCancel={closeModal}
            onOk={handleOk}
            okButtonProps={{ disabled: hasSharedIsrc }}
            confirmLoading={isPreviewing || isTransferring}
            okText={messages('channel.transfer.confirm')}
        >
            {hasSharedIsrc ? (
                <Alert
                    className="mb-4"
                    type="error"
                    showIcon
                    message={messages('channel.transfer.sharedIsrcTitle')}
                    description={
                        <div className="space-y-1">
                            <p>{messages('channel.transfer.sharedIsrcHelp')}</p>
                            <p className="font-medium">
                                {messages('channel.transfer.sharedIsrcList', {
                                    isrcs: sharedIsrcList,
                                })}
                            </p>
                        </div>
                    }
                />
            ) : (
                <Alert
                    className="mb-4"
                    type="info"
                    showIcon
                    message={messages('channel.transfer.hint')}
                />
            )}
            <AppForm form={form} showSubmit={false} layout="vertical">
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
                <div className="mb-3">
                    <Tooltip title={messages('channel.transfer.fromStartHelp')}>
                        <Button
                            size="small"
                            disabled={!preview || hasSharedIsrc}
                            onClick={applyFromStart}
                        >
                            {messages('channel.transfer.fromStart')}
                        </Button>
                    </Tooltip>
                </div>
                <AppFormItem
                    name="effectiveDate"
                    label={messages('channel.transfer.effectiveDate')}
                    required
                    tooltipInfo={messages('channel.transfer.effectiveDateHelp')}
                    tooltipIconClassName="text-red-500"
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
                        placeholder={messages('channel.transfer.selectDate')}
                    />
                </AppFormItem>
                <AppFormItem
                    name="revenueEffectiveFrom"
                    label={messages('channel.transfer.revenueEffectiveFrom')}
                    required
                    tooltipInfo={messages(
                        'channel.transfer.revenueEffectiveFromHelp'
                    )}
                    tooltipIconClassName="text-red-500"
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
                        placeholder={messages('channel.transfer.selectMonth')}
                    />
                </AppFormItem>
            </AppForm>
        </AppModal>
    );
}
