import { formattedNumber } from '@/helpers/common';
import {
    Alert,
    Descriptions,
    Form,
    InputNumber,
    Modal,
    Progress,
    Switch,
} from 'antd';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useEnrichScanEvents } from '../../hooks/use-enrich-scan-events';
import { useStartEnrichScan } from '../../hooks/use-start-enrich-scan';
import {
    EnrichScanEventData,
    EnrichScanEventType,
    EnrichScanSummary,
    StartEnrichScanPayload,
    StartEnrichScanResponse,
} from '../../types/payload';

const ENRICH_SCAN_FORM_DEFAULT_VALUES: StartEnrichScanPayload = {
    dryRun: true,
    limit: 10,
    force: false,
};

const ENRICH_SCAN_LIMIT_MIN = 1;

interface EnrichScanModalProps {
    open: boolean;
    onClose: () => void;
    initialScanId?: string | null;
}

export default function EnrichScanModal({
    open,
    onClose,
    initialScanId,
}: EnrichScanModalProps) {
    const messages = useTranslations();
    const [form] = Form.useForm<StartEnrichScanPayload>();
    const { startEnrichScan, isPending } = useStartEnrichScan();
    const [scanId, setScanId] = useState<string | null>(null);
    const [terminalEvent, setTerminalEvent] =
        useState<EnrichScanEventData | null>(null);

    useEffect(() => {
        if (open) {
            form.setFieldsValue(ENRICH_SCAN_FORM_DEFAULT_VALUES);
            setScanId(initialScanId || null);
        }
    }, [form, initialScanId, open]);

    const handleCompleted = useCallback((eventData: EnrichScanEventData) => {
        setTerminalEvent(eventData);
    }, []);

    const handleFailed = useCallback((eventData: EnrichScanEventData) => {
        setTerminalEvent(eventData);
    }, []);

    const { latestEvent, summary, isListening, error } = useEnrichScanEvents({
        scanId,
        enabled: open && !!scanId,
        onCompleted: handleCompleted,
        onFailed: handleFailed,
    });

    const currentSummary = summary as Partial<EnrichScanSummary> | null;

    const renderEventNumber = (value: number | null | undefined) => {
        return value !== undefined && value !== null
            ? formattedNumber(value)
            : '-';
    };

    const totalRemaining =
        currentSummary?.totalReleases !== undefined &&
        currentSummary?.processedReleases !== undefined
            ? currentSummary.totalReleases - currentSummary.processedReleases
            : undefined;

    const progressPercent = useMemo(() => {
        const totalReleases = currentSummary?.totalReleases || 0;
        const processedReleases = currentSummary?.processedReleases || 0;

        if (!totalReleases) {
            return 0;
        }

        return Math.min(
            Math.round((processedReleases / totalReleases) * 100),
            100
        );
    }, [currentSummary?.processedReleases, currentSummary?.totalReleases]);

    const isScanRunning = isPending || isListening;

    const resetModalState = () => {
        form.resetFields();
        setScanId(null);
        setTerminalEvent(null);
    };

    const handleClose = () => {
        resetModalState();
        onClose();
    };

    const handleOk = () => {
        if (scanId) {
            handleClose();
            return;
        }

        form.validateFields().then((values) => {
            startEnrichScan({
                payload: {
                    dryRun: !!values.dryRun,
                    limit: Number(values.limit),
                    force: !!values.force,
                },
                onSuccess: (response?: StartEnrichScanResponse) => {
                    if (response?.scanId) {
                        setScanId(response.scanId);
                        setTerminalEvent(null);
                    }
                },
            });
        });
    };

    return (
        <Modal
            open={open}
            title={messages('reportConfigs.enrichDataImport.scanModalTitle')}
            okText={
                scanId
                    ? messages('common.close')
                    : messages('reportConfigs.enrichDataImport.scanButton')
            }
            cancelText={messages('analytics2.syncAll.cancel')}
            onCancel={handleClose}
            onOk={handleOk}
            destroyOnClose
            confirmLoading={isPending}
            okButtonProps={{
                disabled: isListening,
            }}
            cancelButtonProps={{ disabled: isPending }}
        >
            {!scanId ? (
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 20 }}
                    initialValues={ENRICH_SCAN_FORM_DEFAULT_VALUES}
                    disabled={isScanRunning}
                >
                    <Form.Item
                        name="dryRun"
                        label={messages(
                            'reportConfigs.enrichDataImport.dryRun'
                        )}
                        tooltip={messages(
                            'reportConfigs.enrichDataImport.dryRunTooltip'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </Form.Item>

                    <Form.Item
                        name="limit"
                        label={messages('reportConfigs.enrichDataImport.limit')}
                    >
                        <InputNumber
                            className="!w-full"
                            min={ENRICH_SCAN_LIMIT_MIN}
                            precision={0}
                        />
                    </Form.Item>

                    <Form.Item
                        name="force"
                        label={messages('reportConfigs.enrichDataImport.force')}
                        tooltip={messages(
                            'reportConfigs.enrichDataImport.forceTooltip'
                        )}
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren={messages('status.enable')}
                            unCheckedChildren={messages('status.disable')}
                        />
                    </Form.Item>
                </Form>
            ) : null}

            {scanId ? (
                <div style={{ marginTop: 16 }}>
                    <Alert
                        type={
                            terminalEvent?.type === EnrichScanEventType.FAILED
                                ? 'error'
                                : terminalEvent?.type ===
                                    EnrichScanEventType.COMPLETED
                                  ? 'success'
                                  : 'info'
                        }
                        showIcon
                        message={
                            terminalEvent?.message ||
                            latestEvent?.message ||
                            currentSummary?.status ||
                            messages(
                                'reportConfigs.enrichDataImport.waitingForEvent'
                            )
                        }
                    />

                    <div style={{ marginTop: 16 }}>
                        <Progress percent={progressPercent} />
                    </div>

                    <Descriptions
                        size="small"
                        bordered
                        column={2}
                        style={{ marginTop: 16 }}
                    >
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.scanId'
                            )}
                            span={2}
                        >
                            {scanId}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.eventType'
                            )}
                        >
                            {latestEvent?.type || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label={messages('common.status')}>
                            {currentSummary?.status || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalReleases'
                            )}
                        >
                            {renderEventNumber(currentSummary?.totalReleases)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalDone'
                            )}
                        >
                            {renderEventNumber(
                                currentSummary?.processedReleases
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.totalRemaining'
                            )}
                        >
                            {renderEventNumber(totalRemaining)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.successCount'
                            )}
                        >
                            {renderEventNumber(currentSummary?.successCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.failedCount'
                            )}
                        >
                            {renderEventNumber(currentSummary?.failedCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.notFoundCount'
                            )}
                        >
                            {renderEventNumber(currentSummary?.notFoundCount)}
                        </Descriptions.Item>
                        <Descriptions.Item
                            label={messages(
                                'reportConfigs.enrichDataImport.errorMessage'
                            )}
                        >
                            {currentSummary?.errorMessage || '-'}
                        </Descriptions.Item>
                    </Descriptions>

                    {error ? (
                        <Alert
                            type="error"
                            showIcon
                            style={{ marginTop: 16 }}
                            message={messages(
                                'reportConfigs.enrichDataImport.eventConnectionError'
                            )}
                            description={error.message}
                        />
                    ) : null}
                </div>
            ) : null}
        </Modal>
    );
}
