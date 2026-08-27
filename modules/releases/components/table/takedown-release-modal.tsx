'use client';

import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import DistributionTable from '@/modules/releases/components/release-detail/release-distribution/components/table';
import { useTakedownRelease } from '@/modules/releases/hooks/use-takedown-release';
import { ReleasesData } from '@/modules/releases/types';
import { Modal, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

type Props = {
    open: boolean;
    record: ReleasesData | null;
    onCancel: () => void;
};

export default function TakedownReleaseModal({
    open,
    record,
    onCancel,
}: Props) {
    const messages = useTranslations();
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
    const { takedownRelease, isPending } = useTakedownRelease();

    const distributedDeliveries = useMemo(() => {
        return (
            record?.releaseDspDeliveries?.filter(
                (delivery) =>
                    Boolean(delivery.hasLiveVersion) ||
                    delivery.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
            ) ?? []
        );
    }, [record]);

    useEffect(() => {
        if (open) {
            const codes = distributedDeliveries
                .map((item) => item.dsp?.code)
                .filter(Boolean) as string[];
            setSelectedCodes(codes);
        }
    }, [distributedDeliveries, open]);

    const handleTakedown = () => {
        if (!record?.id || selectedCodes.length === 0) return;

        takedownRelease({
            id: record.id,
            code: selectedCodes,
            onSuccess: onCancel,
        });
    };

    return (
        <Modal
            open={open}
            title={
                <Typography.Title level={4} className="!mb-0">
                    {messages('release.takeDownConfirmTitle')}
                </Typography.Title>
            }
            okText={messages('release.takeDown')}
            cancelText={messages('common.cancel')}
            okButtonProps={{
                danger: true,
                disabled: selectedCodes.length === 0,
            }}
            confirmLoading={isPending}
            onOk={handleTakedown}
            onCancel={onCancel}
            width={'80vw'}
            centered
        >
            <div className="space-y-4 py-2">
                <Typography.Text>
                    {messages.rich('release.takeDownConfirmContent', {
                        title: record?.title ?? '',
                        b: (chunks) => <strong>{chunks}</strong>,
                    })}
                </Typography.Text>

                {record && (
                    <DistributionTable
                        dataSource={distributedDeliveries}
                        size="middle"
                        rowKey={(item) => item.dsp?.code ?? ''}
                        rowSelection={{
                            selectedRowKeys: selectedCodes,
                            onChange: (keys) =>
                                setSelectedCodes(keys as string[]),
                        }}
                        pagination={{
                            current: 1,
                            pageSize: 999,
                        }}
                        scroll={{
                            x: '70vw',
                            y: '60vh',
                        }}
                        className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-800"
                        options={false}
                    />
                )}
            </div>
        </Modal>
    );
}
