'use client';

import { Table, Tag } from 'antd';

enum IMPORT_STATUS {
    COMPLETE = 'complete',
    PROBLEM = 'problem',
}

const IMPORT_COLUMNS_TITLE = {
    BATCH_EXTERNAL_ID: 'Batch external ID',
    REQUEST_ID: 'Request ID',
    MODIFY_TIME: 'Modify time',
    IMPORT_FILE_ID: 'Import file ID',
    UPC: 'upc',
    STATUS: 'status',
} as const;

interface ImportRecord {
    key: string;
    batchExternalId: string;
    requestId: string;
    modifyTime: string;
    importFileId: string;
    upc: string;
    status: IMPORT_STATUS;
}

const mockImportData: ImportRecord[] = [
    {
        key: '1',
        batchExternalId: '20260616202846501',
        requestId: '118083900220192',
        modifyTime: '2026-06-16 14:34:37',
        importFileId: '118083900370238',
        upc: '7316482525096',
        status: IMPORT_STATUS.COMPLETE,
    },
    {
        key: '2',
        batchExternalId: '20260613124742375',
        requestId: '118077415340192',
        modifyTime: '2026-06-13 06:52:56',
        importFileId: '118077415360238',
        upc: '7316482525096',
        status: IMPORT_STATUS.COMPLETE,
    },
    {
        key: '3',
        batchExternalId: '20260613111220054',
        requestId: '118077297740192',
        modifyTime: '2026-06-13 05:21:55',
        importFileId: '118077297760238',
        upc: '7316482525096',
        status: IMPORT_STATUS.COMPLETE,
    },
    {
        key: '4',
        batchExternalId: '20260613001536662',
        requestId: '118075403190192',
        modifyTime: '2026-06-12 18:30:55',
        importFileId: '118075403210238',
        upc: '7316482525096',
        status: IMPORT_STATUS.COMPLETE,
    },
    {
        key: '5',
        batchExternalId: '20260612190204308',
        requestId: '118074119600192',
        modifyTime: '2026-06-12 13:07:23',
        importFileId: '118074119620238',
        upc: '7316482525096',
        status: IMPORT_STATUS.PROBLEM,
    },
    {
        key: '6',
        batchExternalId: '20260612112053245',
        requestId: '118072799300192',
        modifyTime: '2026-06-12 05:25:22',
        importFileId: '118072799320238',
        upc: '7316482525096',
        status: IMPORT_STATUS.PROBLEM,
    },
    {
        key: '7',
        batchExternalId: '20260612104900207',
        requestId: '118072770850192',
        modifyTime: '2026-06-12 04:52:33',
        importFileId: '118072770870238',
        upc: '7316482525096',
        status: IMPORT_STATUS.PROBLEM,
    },
];

const importColumns = [
    {
        title: IMPORT_COLUMNS_TITLE.BATCH_EXTERNAL_ID,
        dataIndex: 'batchExternalId',
        key: 'batchExternalId',
    },
    {
        title: IMPORT_COLUMNS_TITLE.REQUEST_ID,
        dataIndex: 'requestId',
        key: 'requestId',
    },
    {
        title: IMPORT_COLUMNS_TITLE.MODIFY_TIME,
        dataIndex: 'modifyTime',
        key: 'modifyTime',
    },
    {
        title: IMPORT_COLUMNS_TITLE.IMPORT_FILE_ID,
        dataIndex: 'importFileId',
        key: 'importFileId',
    },
    {
        title: IMPORT_COLUMNS_TITLE.UPC,
        dataIndex: 'upc',
        key: 'upc',
    },
    {
        title: IMPORT_COLUMNS_TITLE.STATUS,
        dataIndex: 'status',
        key: 'status',
        render: (status: IMPORT_STATUS) => {
            const color = status === IMPORT_STATUS.COMPLETE ? 'success' : 'error';
            return <Tag color={color}>{status.toUpperCase()}</Tag>;
        },
    },
];

export default function ImportTab() {
    return (
        <Table
            dataSource={mockImportData}
            columns={importColumns}
            pagination={false}
            className="mt-2"
        />
    );
}
