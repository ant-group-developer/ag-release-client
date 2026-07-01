import { formattedDate } from '@/helpers/common';
import { Button, Modal, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { RELEASE_CI_EXPORT_STATUS } from '../../enums';
import { ReleaseCiData } from '../../types';

interface DspStatusModalProps {
    open: boolean;
    onCancel: () => void;
    record: ReleaseCiData | null;
}

interface ExportParsedItem {
    exportTask: string;
    exportOrder: string;
    deliveryPoint: string;
    externalBatchId: string;
    transferEndDate: string;
    requestorOrganisation: string;
    status?: string;
}

export default function DspStatusModal({
    open,
    onCancel,
    record,
}: DspStatusModalProps) {
    const messages = useTranslations();

    const columns: ColumnsType<ExportParsedItem> = useMemo(
        () => [
            {
                title: messages('releaseCiData.export.exportOrder'),
                key: 'exportOrder',
                dataIndex: 'exportOrder',
                render: (value) => value || '-',
            },
            {
                title: messages('releaseCiData.export.exportTask'),
                key: 'exportTask',
                dataIndex: 'exportTask',
                render: (value) => value || '-',
            },
            {
                title: messages('releaseCiData.export.requestorOrganisation'),
                key: 'requestorOrganisation',
                dataIndex: 'requestorOrganisation',
                render: (value) => value || '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPoint'),
                key: 'deliveryPoint',
                dataIndex: 'deliveryPoint',
                render: (value) => value || '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPointStatus'),
                key: 'deliveryPointStatus',
                dataIndex: 'deliveryPointStatus',
                render: (status) => {
                    if (!status) return '-';

                    const config = {
                        [RELEASE_CI_EXPORT_STATUS.COMPLETE]: {
                            color: 'success',
                            label: status,
                        },
                        [RELEASE_CI_EXPORT_STATUS.LIVE]: {
                            color: 'success',
                            label: status,
                        },
                        [RELEASE_CI_EXPORT_STATUS.SYSFAIL]: {
                            color: 'error',
                            label: status,
                        },
                        [RELEASE_CI_EXPORT_STATUS.INVALID]: {
                            color: 'warning',
                            label: status,
                        },
                    }[status as RELEASE_CI_EXPORT_STATUS] || {
                        color: 'default',
                        label: status,
                    };

                    return (
                        <Tag color={config.color} className="capitalize">
                            {config.label}
                        </Tag>
                    );
                },
            },
            {
                title: 'External batch ID',
                key: 'externalBatchId',
                dataIndex: 'externalBatchId',
                render: (value) => value || '-',
            },
            {
                title: messages('releaseCiData.export.transferEndDate'),
                key: 'transferEndDate',
                dataIndex: 'transferEndDate',
                render: (value) => formattedDate(value) || '-',
            },
        ],
        [messages]
    );

    return (
        <Modal
            title={
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {record && `${record.release?.title}`}
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" type="primary" onClick={onCancel}>
                    {messages('common.close')}
                </Button>,
            ]}
            width={'80vw'}
            centered
        >
            <div className="py-2">
                {record && (
                    <Table
                        dataSource={
                            (record?.exportParsedData as ExportParsedItem[]) ??
                            []
                        }
                        columns={columns}
                        pagination={false}
                        size="middle"
                        scroll={{
                            x: '70vh',
                            y: '50vh',
                        }}
                        className="overflow-hidden rounded-lg border border-slate-100 dark:border-zinc-800"
                    />
                )}
            </div>
        </Modal>
    );
}
