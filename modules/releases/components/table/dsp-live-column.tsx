'use client';

import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import { Badge, Typography } from 'antd';
import { useTranslations } from 'next-intl';

interface DspLiveColumnProps {
    releaseDspDeliveries?: ReleaseDspData[];
    onClick?: () => void;
}

interface DspStatusLineProps {
    status: 'success' | 'processing' | 'error' | 'default';
    label: string;
    countText: string | number;
}

function DspStatusLine({ status, label, countText }: DspStatusLineProps) {
    return (
        <div className="flex items-center gap-1.5 text-xs leading-tight">
            <Badge status={status} />
            <Typography.Text type="secondary" className="text-xs">
                {label}:
            </Typography.Text>
            <Typography.Text className="text-xs">{countText}</Typography.Text>
        </div>
    );
}

export default function DspLiveColumn({
    releaseDspDeliveries = [],
    onClick,
}: DspLiveColumnProps) {
    const messages = useTranslations();

    const totalCount = releaseDspDeliveries.length;

    if (!totalCount) {
        return (
            <div data-stop-row-click="true">
                <Typography.Text type="secondary" className="text-xs">
                    0/0
                </Typography.Text>
            </div>
        );
    }

    const successCount = releaseDspDeliveries.filter(
        (item) => item.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
    ).length;

    const failedCount = releaseDspDeliveries.filter(
        (item) => item.status === RELEASE_DSP_DELIVERY_STATUS.ISSUES
    ).length;

    const processingCount = releaseDspDeliveries.filter(
        (item) => item.status === RELEASE_DSP_DELIVERY_STATUS.PROCESSING
    ).length;

    const otherCount =
        totalCount - (successCount + failedCount + processingCount);

    return (
        <div
            data-stop-row-click="true"
            className="group cursor-pointer transition-opacity hover:opacity-80"
            onClick={onClick}
        >
            <CustomTooltip title={messages('common.seeMore')}>
                <div className="flex flex-col">
                    <DspStatusLine
                        status="success"
                        label={messages('common.distribute')}
                        countText={`${successCount}/${totalCount}`}
                    />
                    <DspStatusLine
                        status="processing"
                        label={messages('common.processing')}
                        countText={processingCount}
                    />
                    <DspStatusLine
                        status="error"
                        label={messages('releaseDsp.status.issues')}
                        countText={failedCount}
                    />
                </div>
            </CustomTooltip>
        </div>
    );
}
