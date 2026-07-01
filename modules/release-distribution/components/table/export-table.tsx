'use client';

import { formattedDate } from '@/helpers/common';
import { RELEASE_CI_EXPORT_STATUS } from '@/modules/release-distribution/enums';
import { ReleaseCiExportEmbeddedItem } from '@/modules/release-distribution/types';
import { Table, TableProps, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

type ExportTableProps = Omit<TableProps<any>, 'columns'>;

export default function ExportTable({ dataSource, ...props }: ExportTableProps) {
    const messages = useTranslations();

    const exportColumns: ColumnsType<any> = useMemo(
        () => [
            {
                title: messages('releaseCiData.export.exportOrder'),
                key: 'exportOrder',
                render: (_, record) => record.exportOrder ?? record.exportRequest?.export_id ?? '-',
            },
            {
                title: messages('releaseCiData.export.exportTask'),
                key: 'exportTask',
                render: (_, record) => record.exportTask ?? record.exportRequest?.type ?? '-',
            },
            {
                title: messages('releaseCiData.export.requestorOrganisation'),
                key: 'requestorOrganisation',
                render: (_, record) => record.requestorOrganisation ?? record.exportRequest?.organisation?.name ?? '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPoint'),
                key: 'deliveryPoint',
                render: (_, record) => record.deliveryPoint ?? record?.musicService?.name ?? '-',
            },
            {
                title: messages('releaseCiData.export.deliveryPointStatus'),
                key: 'deliveryPointStatus',
                render: (_, record) => {
                    const status =
                        record.status ?? record.deliveryPointStatus ?? record.musicService?.development_status;

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
                render: (_, record) => record.externalBatchId ?? record.exportBatch?.external_batch_id ?? '-',
            },
            {
                title: messages('releaseCiData.export.transferEndDate'),
                key: 'transferEndDate',
                render: (_, record) => formattedDate(record.transferEndDate ?? record.modify_time) ?? '-',
            },
        ],
        [messages]
    );

    return (
        <Table
            rowKey={(record, index) => record.id ?? `parsed-${index}`}
            dataSource={dataSource}
            columns={exportColumns}
            pagination={false}
            {...props}
        />
    );
}
