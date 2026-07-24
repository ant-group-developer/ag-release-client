import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useGetTenantDsps } from '@/modules/dsp-tenant/hooks/use-get-tenant-dsps';
import { Checkbox, Empty, Modal, Radio, Space, Spin, Tag, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';
import { EXECUTION_TYPE } from '../../enums';
import { useSubmitDistribution } from '../../hooks/use-submit-distribution';

interface Props {
    open: boolean;
    releaseId: string;
    onClose: () => void;
    onSubmitted?: () => void;
}

const SUBMIT_TYPES = [
    EXECUTION_TYPE.INITIAL_RELEASE,
    EXECUTION_TYPE.UPDATE,
    EXECUTION_TYPE.TAKEDOWN,
];

/**
 * Modal chọn DSP + loại submit. Nguồn DSP = tenant truy cập được (useGetTenantDsps),
 * mặc định tích các DSP active; user bỏ tích DSP không muốn phát hành.
 * Client gửi dspCodes[]; server tự resolve spec.
 */
export default function SubmitDspModal({
    open,
    releaseId,
    onClose,
    onSubmitted,
}: Props) {
    const messages = useTranslations();
    const { isSystemTenant } = useAuth();

    const { dspData, isFetching } = useGetTenantDsps({});
    const { submitDistribution, isPending } = useSubmitDistribution();

    const [type, setType] = useState<EXECUTION_TYPE>(
        EXECUTION_TYPE.INITIAL_RELEASE
    );
    const [checked, setChecked] = useState<string[]>([]);

    // DSP khả dụng (active) — mặc định tích hết khi mở modal.
    const availableDsps = useMemo(
        () => dspData.filter((d) => d.isActive && d.dsp?.code),
        [dspData]
    );

    useEffect(() => {
        if (open) {
            setChecked(availableDsps.map((d) => d.dsp.code));
        }
    }, [open, availableDsps]);

    const topologyLabel = (mode: string | null, hasDeal?: boolean) => {
        if (mode === 'DIRECT') return messages('distributionOrchestration.submit.direct');
        const lane = hasDeal ? 'CI' : 'State51';
        return `${messages('distributionOrchestration.submit.aggregator')} · ${lane}`;
    };

    const handleSubmit = () => {
        submitDistribution({
            payload: { releaseId, type, dspCodes: checked },
            onSuccess: () => {
                onSubmitted?.();
                onClose();
            },
        });
    };

    return (
        <Modal
            open={open}
            title={messages('distributionOrchestration.actions.submit')}
            okText={messages('distributionOrchestration.actions.submit')}
            okButtonProps={{
                loading: isPending,
                disabled: checked.length === 0,
            }}
            onOk={handleSubmit}
            onCancel={onClose}
            width={560}
            destroyOnClose
        >
            <Space direction="vertical" size="middle" className="w-full">
                <div>
                    <Typography.Text strong>
                        {messages('distributionOrchestration.submit.type')}
                    </Typography.Text>
                    <div className="mt-1">
                        <Radio.Group
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            {SUBMIT_TYPES.map((t) => (
                                <Radio key={t} value={t}>
                                    {messages(
                                        `distributionOrchestration.executionType.${t}`
                                    )}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                </div>

                <div>
                    <Space className="mb-1 justify-between w-full">
                        <Typography.Text strong>
                            {messages('distributionOrchestration.submit.selectDsp')}
                        </Typography.Text>
                        <Checkbox
                            checked={
                                checked.length === availableDsps.length &&
                                availableDsps.length > 0
                            }
                            indeterminate={
                                checked.length > 0 &&
                                checked.length < availableDsps.length
                            }
                            onChange={(e) =>
                                setChecked(
                                    e.target.checked
                                        ? availableDsps.map((d) => d.dsp.code)
                                        : []
                                )
                            }
                        >
                            {messages('common.all')}
                        </Checkbox>
                    </Space>

                    {isFetching ? (
                        <div className="flex justify-center py-6">
                            <Spin />
                        </div>
                    ) : availableDsps.length === 0 ? (
                        <Empty
                            description={
                                isSystemTenant
                                    ? messages(
                                          'distributionOrchestration.submit.systemTenantNoDsp'
                                      )
                                    : messages('common.noDataAvailable')
                            }
                        />
                    ) : (
                        <Checkbox.Group
                            value={checked}
                            onChange={(v) => setChecked(v as string[])}
                            className="w-full"
                        >
                            <Space direction="vertical" className="w-full">
                                {availableDsps.map((d) => (
                                    <div
                                        key={d.dsp.code}
                                        className="flex items-center justify-between w-full"
                                    >
                                        <Checkbox value={d.dsp.code}>
                                            {d.dsp.name}
                                        </Checkbox>
                                        <Tag bordered={false}>
                                            {topologyLabel(
                                                d.mode,
                                                d.dsp?.hasDeal
                                            )}
                                        </Tag>
                                    </div>
                                ))}
                            </Space>
                        </Checkbox.Group>
                    )}
                </div>
            </Space>
        </Modal>
    );
}
