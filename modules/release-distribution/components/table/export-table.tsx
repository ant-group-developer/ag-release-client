'use client';

import { formattedDate } from '@/helpers/common';
import { RELEASE_CI_EXPORT_STATUS } from '@/modules/release-distribution/enums';
import { ReleaseCiExportEmbeddedItem } from '@/modules/release-distribution/types';
import { Table, TableProps, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type ExportTableProps = Omit<TableProps<ReleaseCiExportEmbeddedItem>, 'columns'>;

export default function ExportTable({ dataSource, ...props }: ExportTableProps) {
    const messages = useTranslations();

    const exportColumns: ColumnsType<ReleaseCiExportEmbeddedItem> = useMemo(
        () => [
            {
                title: messages('releaseCiData.export.exportOrder'),
                key: 'exportOrder',
                render: (_, record) => record.exportRequest?.export_id ?? '-',
            },
            {
                title: messages('releaseCiData.export.exportTask'),
                key: 'exportTask',
                render: (_, record) => record.exportRequest?.type ?? '-',
            },
            {
                title: messages('releaseCiData.export.requestorOrganisation'),
                key: 'requestorOrganisation',
                render: (_, record) => record.exportRequest?.organisation?.name ?? '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPoint'),
                key: 'deliveryPoint',
                render: (_, record) => record?.musicService?.name ?? '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPointStatus'),
                key: 'deliveryPointStatus',
                render: (_, record) => {
                    const status =
                        record.status ?? record.musicService?.development_status;

                    if (!status) return '-';

                    const config = {
                        [RELEASE_CI_EXPORT_STATUS.COMPLETE]: {
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
                render: (_, record) => record.exportBatch?.external_batch_id ?? '-',
            },
            {
                title: messages('releaseCiData.export.transferEndDate'),
                key: 'transferEndDate',
                render: (_, record) => formattedDate(record.modify_time) ?? '-',
            },
        ],
        [messages]
    );

    return (
        <Table
            rowKey={(record) => record.id}
            dataSource={dataSource}
            columns={exportColumns}
            pagination={false}
            {...props}
        />
    );
}
