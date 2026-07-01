'use client';

import { Button, Modal, Table } from 'antd';
import { useTranslations } from 'next-intl';
import { ReleasesData } from '../../types';

interface DspStatusModalProps {
    open: boolean;
    onCancel: () => void;
    record: ReleasesData | null;
}

const FAKE_DSP_DATA = [
    {
        key: '1',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Facebook Audio Library (FBL)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619162241506',
        transferEndDate: '2026-06-19 18:31:19',
    },
    {
        key: '2',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Anghami (ANG)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619160951877',
        transferEndDate: '2026-06-19 17:16:26',
    },
    {
        key: '3',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Audiomack (ADM)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619095325739',
        transferEndDate: '2026-06-19 11:10:05',
    },
    {
        key: '4',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Boomplay Music (BOM)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619095330135',
        transferEndDate: '2026-06-19 11:27:40',
    },
    {
        key: '5',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Deezer (DEE)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260620032435085',
        transferEndDate: '2026-06-20 07:41:50',
    },
    {
        key: '6',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'iHeartRadio All Access/Plus (AAP)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260620062745748',
        transferEndDate: '2026-06-20 08:02:30',
    },
    {
        key: '7',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'Peloton (PEL)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619105705536',
        transferEndDate: '2026-06-19 12:27:51',
    },
    {
        key: '8',
        exportOrder: '118115289510191',
        exportTask: 'Export',
        requestorOrganisation: 'ANT MUSIC LLC',
        deliveryPoint: 'SoundCloud Commercial Only (SCM)',
        deliveryPointStatus: 'live',
        externalBatchId: '20260619095535601',
        transferEndDate: '2026-06-19 11:56:37',
    },
];

export default function DspStatusModal({
    open,
    onCancel,
    record,
}: DspStatusModalProps) {
    const messages = useTranslations();

    const columns = [
        {
            title: 'Export order',
            dataIndex: 'exportOrder',
            key: 'exportOrder',
        },
        {
            title: 'Export task',
            dataIndex: 'exportTask',
            key: 'exportTask',
        },
        {
            title: 'Requestor organisation',
            dataIndex: 'requestorOrganisation',
            key: 'requestorOrganisation',
        },
        {
            title: 'Delivery point',
            dataIndex: 'deliveryPoint',
            key: 'deliveryPoint',
        },
        {
            title: 'Delivery point status',
            dataIndex: 'deliveryPointStatus',
            key: 'deliveryPointStatus',
            render: (status: string) => (
                <span className="font-semibold text-green-600">{status}</span>
            ),
        },
        {
            title: 'External batch id',
            dataIndex: 'externalBatchId',
            key: 'externalBatchId',
        },
        {
            title: 'Transfer end date',
            dataIndex: 'transferEndDate',
            key: 'transferEndDate',
        },
    ];

    return (
        <Modal
            title={
                <div className="text-lg font-bold text-slate-800 dark:text-white">
                    {record && `${record.title}`}
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
                        dataSource={FAKE_DSP_DATA}
                        columns={columns}
                        pagination={false}
                        size="middle"
                        rowKey="key"
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
