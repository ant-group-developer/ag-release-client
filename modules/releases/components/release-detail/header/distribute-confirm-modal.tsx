import AppModal from '@/components/ui/modal/normal-modal';
import { FALLBACK_IMAGE } from '@/constants/common';
import { RELEASE_DSP_DELIVERY_STATUS } from '@/modules/distribution/enum';
import { ReleaseDspData } from '@/modules/release-dsp/types';
import { Avatar, Button, Checkbox, Typography, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type Props = {
    open: boolean;
    onCancel: () => void;
    onConfirm: (selectedCodes: string[]) => void;
    selectedRows: ReleaseDspData[];
    loading?: boolean;
};

export default function DistributeConfirmModal({
    open,
    onCancel,
    onConfirm,
    selectedRows,
    loading = false,
}: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();
    const [skipDistributed, setSkipDistributed] = useState(true);

    const { toDistributeList, skippedList, effectiveCodes, activeCount } =
        useMemo(() => {
            const toDistribute = skipDistributed
                ? selectedRows.filter(
                      (row) =>
                          row.status !== RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                  )
                : selectedRows;
            const skipped = skipDistributed
                ? selectedRows.filter(
                      (row) =>
                          row.status === RELEASE_DSP_DELIVERY_STATUS.DISTRIBUTED
                  )
                : [];
            const codes = toDistribute
                .map((row) => row.dsp?.code)
                .filter((code): code is string => Boolean(code));
            return {
                toDistributeList: toDistribute,
                skippedList: skipped,
                effectiveCodes: codes,
                activeCount: codes.length,
            };
        }, [selectedRows, skipDistributed]);

    const handleOk = () => {
        if (effectiveCodes.length > 0) {
            onConfirm(effectiveCodes);
        }
    };

    return (
        <AppModal
            open={open}
            onCancel={onCancel}
            width={840}
            title={
                <Typography className="!mb-0 !text-lg">
                    {messages('distribute.confirmTitle')}
                </Typography>
            }
            footer={
                <div className="flex items-center justify-between pt-2">
                    <div>
                        {activeCount === 0 && (
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
                            disabled={activeCount === 0 || loading}
                            onClick={handleOk}
                            className="!rounded-lg"
                        >
                            {messages('distribute.label')}
                        </Button>
                    </div>
                </div>
            }
        >
            <div className="space-y-4 py-3">
                <div>
                    <Checkbox
                        checked={skipDistributed}
                        onChange={(e) => setSkipDistributed(e.target.checked)}
                    >
                        <Typography.Text strong className="text-base">
                            {messages('distribute.skipDistributed')}
                        </Typography.Text>
                    </Checkbox>
                </div>

                <div className="thin-scrollbar max-h-[60vh] space-y-4 overflow-y-auto pr-1">
                    {/* List DSPs to distribute */}
                    <div className="space-y-2">
                        <Typography.Text strong className="text-base">
                            {skipDistributed
                                ? messages('distribute.dspsToDistribute', {
                                      count: toDistributeList.length,
                                  })
                                : messages('distribute.selectedDsps', {
                                      count: selectedRows.length,
                                  })}
                        </Typography.Text>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                            {toDistributeList.map((row) => (
                                <div
                                    key={row.id || row.dsp?.id || row.dsp?.code}
                                    className="shadow-xs flex items-center gap-3 rounded-xl border p-2.5 transition-all"
                                    style={{
                                        borderColor: token.colorBorderSecondary,
                                        backgroundColor: token.colorBgContainer,
                                    }}
                                >
                                    <Avatar
                                        src={row.dsp?.picture || FALLBACK_IMAGE}
                                        alt={row.dsp?.name || row.dsp?.code}
                                        size={32}
                                        shape="square"
                                        className="shrink-0 !rounded-lg"
                                    />
                                    <Typography.Text
                                        strong
                                        ellipsis={{
                                            tooltip:
                                                row.dsp?.name || row.dsp?.code,
                                        }}
                                        className="text-sm font-semibold"
                                    >
                                        {row.dsp?.name || row.dsp?.code}
                                    </Typography.Text>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Skipped DSPs section if skipDistributed is checked */}
                    {skipDistributed && skippedList.length > 0 && (
                        <div
                            className="space-y-2 border-t pt-3"
                            style={{
                                borderColor: token.colorBorderSecondary,
                            }}
                        >
                            <Typography.Text
                                type="secondary"
                                strong
                                className="text-sm"
                            >
                                {messages('distribute.skippedDsps', {
                                    count: skippedList.length,
                                })}
                            </Typography.Text>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4">
                                {skippedList.map((row) => (
                                    <div
                                        key={
                                            row.id ||
                                            row.dsp?.id ||
                                            row.dsp?.code
                                        }
                                        className="flex items-center gap-3 rounded-xl border p-2.5 opacity-50 grayscale transition-all"
                                        style={{
                                            borderColor:
                                                token.colorBorderSecondary,
                                            backgroundColor:
                                                token.colorBgLayout,
                                        }}
                                    >
                                        <Avatar
                                            src={
                                                row.dsp?.picture ||
                                                FALLBACK_IMAGE
                                            }
                                            alt={row.dsp?.name || row.dsp?.code}
                                            size={32}
                                            shape="square"
                                            className="shrink-0 !rounded-lg"
                                        />
                                        <Typography.Text
                                            type="secondary"
                                            ellipsis={{
                                                tooltip:
                                                    row.dsp?.name ||
                                                    row.dsp?.code,
                                            }}
                                            className="text-sm font-medium"
                                        >
                                            {row.dsp?.name || row.dsp?.code}
                                        </Typography.Text>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppModal>
    );
}
