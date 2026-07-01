'use client';

import { formattedDate } from '@/helpers/common';
import { RELEASE_CI_IMPORT_STATUS } from '@/modules/release-distribution/enums';
import {
    ReleaseCiImportEmbeddedItem,
    ReleaseCiImportRawData,
} from '@/modules/release-distribution/types';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type Props = {
    data?: ReleaseCiImportRawData;
    loading?: boolean;
};

export default function ImportTab({ data, loading }: Props) {
    const messages = useTranslations();

    const importColumns: ColumnsType<ReleaseCiImportEmbeddedItem> = useMemo(
        () => [
            {
                title: 'Batch external ID',
                key: 'batchExternalId',
                render: (_, record) => record.import_external_identifier ?? '-',
            },
            {
                title: 'Request ID',
                key: 'requestId',
                render: (_, record) => record.importEntity?.import_id ?? '-',
            },

            {
                title: 'Import file ID',
                key: 'importFileId',
                render: (_, record) => {
                    const importFile = record.import_file?.[0];

                    return (
                        importFile?.import_file_id ?? importFile?.file_id ?? '-'
                    );
                },
            },
            {
                title: 'UPC',
                key: 'upc',
                render: (_, record) => record.import_file?.[0]?.GTIN ?? '-',
            },
            {
                title: messages('common.status'),
                key: 'status',
                render: (_, record) => {
                    const status = record.status;

                    if (!status) return '-';

                    const config = {
                        [RELEASE_CI_IMPORT_STATUS.COMPLETE]: {
                            color: 'success',
                            label: status,
                        },
                        [RELEASE_CI_IMPORT_STATUS.PROBLEM]: {
                            color: 'error',
                            label: status,
                        },
                    }[status as RELEASE_CI_IMPORT_STATUS] || {
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
                title: messages('common.modifyTime'),
                key: 'modifyTime',
                render: (_, record) => formattedDate(record.modify_time) ?? '-',
            },
        ],
        [messages]
    );

    return (
        <Table
            sticky
            rowKey={(record) => record.id}
            dataSource={data?._embedded ?? []}
            columns={importColumns}
            loading={loading}
            pagination={false}
            className="mt-2"
        />
    );
}
