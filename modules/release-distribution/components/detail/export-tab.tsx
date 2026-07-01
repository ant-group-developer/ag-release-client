'use client';

import { Table } from 'antd';

interface ExportRecord {
    key: string;
    exportOrder: string;
    exportTask: string;
    requestorOrganisation: string;
    deliveryPoint: string;
    deliveryPointStatus: string;
    externalBatchId: string;
    transferEndDate: string;
}

const mockExportData: ExportRecord[] = [
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
        externalBatchId: '2026061916095325739',
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
];

const exportColumns = [
    {
        title: 'EXPORT ORDER',
        dataIndex: 'exportOrder',
        key: 'exportOrder',
    },
    {
        title: 'EXPORT TASK',
        dataIndex: 'exportTask',
        key: 'exportTask',
    },
    {
        title: 'REQUESTOR ORGANISATION',
        dataIndex: 'requestorOrganisation',
        key: 'requestorOrganisation',
    },
    {
        title: 'DELIVERY POINT',
        dataIndex: 'deliveryPoint',
        key: 'deliveryPoint',
    },
    {
        title: 'DELIVERY POINT STATUS',
        dataIndex: 'deliveryPointStatus',
        key: 'deliveryPointStatus',
        render: (status: string) => (
            <span className="font-medium text-green-500">{status}</span>
        ),
    },
    {
        title: 'EXTERNAL BATCH ID',
        dataIndex: 'externalBatchId',
        key: 'externalBatchId',
    },
    {
        title: 'TRANSFER END DATE',
        dataIndex: 'transferEndDate',
        key: 'transferEndDate',
    },
];

export default function ExportTab() {
    return (
        <Table
            dataSource={mockExportData}
            columns={exportColumns}
            pagination={false}
            className="mt-2"
        />
    );
}
