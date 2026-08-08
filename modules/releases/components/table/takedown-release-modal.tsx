import { FALLBACK_IMAGE } from '@/constants/common';
import { useTakedownRelease } from '@/modules/releases/hooks/use-takedown-release';
import { ReleasesData } from '@/modules/releases/types';
import { Avatar, Checkbox, Empty, Modal, Typography } from 'antd';
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

    const activeDsps = useMemo(() => {
        const uniqueDsps = new Map<
            string,
            NonNullable<ReleasesData['releaseDspDeliveries']>[number]['dsp']
        >();

        record?.releaseDspDeliveries
            ?.filter((delivery) => delivery.dsp?.isActive === true)
            .forEach((delivery) => {
                if (delivery.dsp?.code) {
                    uniqueDsps.set(delivery.dsp.code, delivery.dsp);
                }
            });

        return Array.from(uniqueDsps.values());
    }, [record]);

    useEffect(() => {
        if (open) {
            setSelectedCodes(activeDsps.map((dsp) => dsp.code));
        }
    }, [activeDsps, open, record?.id]);

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
            title={messages('release.takeDownConfirmTitle')}
            okText={messages('release.takeDown')}
            cancelText={messages('common.cancel')}
            okButtonProps={{
                danger: true,
                disabled: selectedCodes.length === 0,
            }}
            confirmLoading={isPending}
            onOk={handleTakedown}
            onCancel={onCancel}
        >
            <div className="space-y-4">
                <Typography.Text>
                    {messages.rich('release.takeDownConfirmContent', {
                        title: record?.title ?? '',
                        b: (chunks) => <strong>{chunks}</strong>,
                    })}
                </Typography.Text>

                <div>
                    <Typography.Text strong>
                        {messages('placeholder.selectDsp')}
                    </Typography.Text>

                    {activeDsps.length > 0 ? (
                        <Checkbox.Group
                            className="mt-3 w-full"
                            value={selectedCodes}
                            onChange={(values) =>
                                setSelectedCodes(values as string[])
                            }
                        >
                            <div className="flex max-h-64 w-full flex-col gap-2 overflow-y-auto pr-2">
                                {activeDsps.map((dsp) => (
                                    <Checkbox key={dsp.code} value={dsp.code}>
                                        <span className="inline-flex items-center gap-2">
                                            <Avatar
                                                size={24}
                                                src={
                                                    dsp.picture ??
                                                    FALLBACK_IMAGE
                                                }
                                            />
                                            <Typography.Text>
                                                {dsp.name}
                                            </Typography.Text>
                                        </span>
                                    </Checkbox>
                                ))}
                            </div>
                        </Checkbox.Group>
                    ) : (
                        <Empty
                            className="mt-3"
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={messages('common.noDataAvailable')}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}
