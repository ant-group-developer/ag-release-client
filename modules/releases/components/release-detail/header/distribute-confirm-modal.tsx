import AppModal from '@/components/ui/modal/normal-modal';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { RELEASES_STATUS } from '@/modules/releases/enums';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import { Alert, Button, Empty, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import DspCardItem from './sub-components/dsp-card-item';
import DspFilterBar from './sub-components/dsp-filter-bar';

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: (selectedCodes: string[]) => void;
    selectedRows: ReleaseDspData[];
    loading?: boolean;
    releaseStatus?: string;
};

export default function DistributeConfirmModal({
    open,
    onCancel,
    onConfirm,
    selectedRows,
    loading = false,
    releaseStatus,
}: Props) {
    const messages = useTranslations();
    const [skipDistributed, setSkipDistributed] = useState(true);
    const [selectedCodes, setSelectedCodes] = useState<string[]>([]);

    const isProcessing = useMemo(() => {
        return (
            releaseStatus === RELEASES_STATUS.PROCESSING ||
            releaseStatus === RELEASE_DSP_DELIVERY_STATUS.PROCESSING ||
            selectedRows.some(
                (row) => row.status === RELEASE_DSP_DELIVERY_STATUS.PROCESSING
            )
        );
    }, [releaseStatus, selectedRows]);

    useEffect(() => {
        if (open) {
            const initialCodes = selectedRows
                .filter((row) =>
                    skipDistributed
                        ? row.status !== RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                        : true
                )
                .map((row) => row.dsp?.code)
                .filter((code): code is string => Boolean(code));
            setSelectedCodes(initialCodes);
        }
    }, [open, selectedRows, skipDistributed]);

    const handleToggleSkipDistributed = (checked: boolean) => {
        setSkipDistributed(checked);
        if (checked) {
            const distributedCodes = new Set(
                selectedRows
                    .filter(
                        (row) =>
                            row.status ===
                            RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                    )
                    .map((row) => row.dsp?.code)
            );
            setSelectedCodes((prev) =>
                prev.filter((code) => !distributedCodes.has(code))
            );
        } else {
            const distributedCodes = selectedRows
                .filter(
                    (row) =>
                        row.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                )
                .map((row) => row.dsp?.code)
                .filter((code): code is string => Boolean(code));
            setSelectedCodes((prev) =>
                Array.from(new Set([...prev, ...distributedCodes]))
            );
        }
    };

    const displayedRows = useMemo(() => {
        return selectedRows.filter((row) => {
            if (
                skipDistributed &&
                row.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
            ) {
                return false;
            }
            return true;
        });
    }, [selectedRows, skipDistributed]);

    const handleToggleSelectCard = (code: string) => {
        setSelectedCodes((prev) =>
            prev.includes(code)
                ? prev.filter((c) => c !== code)
                : [...prev, code]
        );
    };

    const isAllDisplayedSelected = useMemo(() => {
        if (displayedRows.length === 0) return false;
        return displayedRows.every(
            (row) => row.dsp?.code && selectedCodes.includes(row.dsp.code)
        );
    }, [displayedRows, selectedCodes]);

    const isIndeterminate = useMemo(() => {
        const displayedCodes = displayedRows
            .map((row) => row.dsp?.code)
            .filter((code): code is string => Boolean(code));
        const selectedDisplayedCount = displayedCodes.filter((code) =>
            selectedCodes.includes(code)
        ).length;
        return (
            selectedDisplayedCount > 0 &&
            selectedDisplayedCount < displayedCodes.length
        );
    }, [displayedRows, selectedCodes]);

    const handleToggleSelectAll = () => {
        const displayedCodes = displayedRows
            .map((row) => row.dsp?.code)
            .filter((code): code is string => Boolean(code));

        if (isAllDisplayedSelected) {
            setSelectedCodes((prev) =>
                prev.filter((code) => !displayedCodes.includes(code))
            );
        } else {
            setSelectedCodes((prev) =>
                Array.from(new Set([...prev, ...displayedCodes]))
            );
        }
    };

    const handleConfirm = () => {
        if (selectedCodes.length > 0) {
            onConfirm(selectedCodes);
        }
    };

    return (
        <AppModal
            open={open}
            onCancel={onCancel}
            width={900}
            title={
                <Typography.Text className="!mb-0 text-base font-semibold">
                    {messages('distribute.confirmTitle')}
                </Typography.Text>
            }
            footer={
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div>
                        {selectedCodes.length > 0 ? (
                            <Typography.Text className="text-sm font-medium">
                                •{' '}
                                {messages('distribute.selectedCountNotice', {
                                    selected: selectedCodes.length,
                                    total: selectedRows.length,
                                })}
                            </Typography.Text>
                        ) : (
                            <Typography.Text
                                type="danger"
                                strong
                                className="text-sm"
                            >
                                {messages('distribute.noDspToSend')}
                            </Typography.Text>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            disabled={loading}
                            onClick={onCancel}
                            className="!rounded-lg"
                        >
                            {messages('common.cancel')}
                        </Button>
                        <Button
                            type="primary"
                            loading={loading}
                            disabled={selectedCodes.length === 0 || loading}
                            onClick={handleConfirm}
                            className="!rounded-lg"
                        >
                            {messages('distribute.distributeNow')}
                            {selectedCodes.length > 0
                                ? ` (${selectedCodes.length})`
                                : ''}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-4 py-2">
                {isProcessing && (
                    <Alert
                        type="warning"
                        showIcon
                        message={messages('distribute.processingWarning')}
                        className="!rounded-lg"
                    />
                )}

                <DspFilterBar
                    isAllSelected={isAllDisplayedSelected}
                    isIndeterminate={isIndeterminate}
                    onToggleSelectAll={handleToggleSelectAll}
                    skipDistributed={skipDistributed}
                    onToggleSkipDistributed={handleToggleSkipDistributed}
                />

                <div className="thin-scrollbar max-h-[60vh] overflow-y-auto pr-1">
                    {displayedRows.length > 0 ? (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                            {displayedRows.map((row) => (
                                <DspCardItem
                                    key={
                                        row.id ||
                                        row.dsp?.id ||
                                        row.dsp?.code
                                    }
                                    row={row}
                                    isSelected={Boolean(
                                        row.dsp?.code &&
                                            selectedCodes.includes(
                                                row.dsp.code
                                            )
                                    )}
                                    onToggleSelect={handleToggleSelectCard}
                                />
                            ))}
                        </div>
                    ) : (
                        <Empty className="my-8" />
                    )}
                </div>
            </div>
        </AppModal>
    );
}
